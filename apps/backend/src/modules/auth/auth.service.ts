import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import {
  UserRole,
  IndustryType,
  SubscriptionPlanTier,
  SubscriptionStatus,
  JwtUserPayload,
} from '@nexaflow/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const slug = dto.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .concat('-', Math.random().toString(36).substring(2, 6));

    // Transaction to create User, Tenant, Membership, Free Trial Subscription, and default AI Assistant
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          fullName: dto.fullName,
          phone: dto.phone,
          role: UserRole.BUSINESS_OWNER,
          isEmailVerified: false,
          isPhoneVerified: false,
          status: 'ACTIVE',
        },
      });

      const tenant = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          industry: dto.industry || IndustryType.OTHER,
          phone: dto.phone || '',
          email: dto.email.toLowerCase(),
          status: 'ACTIVE',
        },
      });

      await tx.tenantMember.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: UserRole.BUSINESS_OWNER,
          isOwner: true,
          permissions: ['*'],
        },
      });

      // Free Trial Subscription
      const trialPlan = await tx.subscriptionPlan.findUnique({
        where: { tier: SubscriptionPlanTier.FREE_TRIAL },
      });

      if (trialPlan) {
        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: trialPlan.id,
            status: SubscriptionStatus.TRIALING,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          },
        });
      }

      // Default AI Assistant for Tenant
      await tx.aiAssistant.create({
        data: {
          tenantId: tenant.id,
          name: `${dto.businessName} Assistant`,
          personality: 'Helpful, warm, professional, and knowledgeable about the business.',
          businessIntro: `Welcome to ${dto.businessName}. We are here to assist you with inquiries, appointments, and support.`,
          isEnabled: true,
        },
      });

      // Default WhatsApp Account placeholder
      await tx.whatsAppAccount.create({
        data: {
          tenantId: tenant.id,
          name: `${dto.businessName} WhatsApp`,
          status: 'DISCONNECTED',
        },
      });

      return { user, tenant };
    });

    const tokens = await this.generateTokens({
      userId: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      role: result.user.role as UserRole,
      tenantId: result.tenant.id,
      tenantSlug: result.tenant.slug,
      permissions: ['*'] as any,
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
        tenantId: result.tenant.id,
        tenantSlug: result.tenant.slug,
        businessName: result.tenant.name,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended. Please contact platform support.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const primaryMembership = user.memberships[0];
    const tenant = primaryMembership?.tenant;

    const payload: JwtUserPayload = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as UserRole,
      tenantId: tenant?.id,
      tenantSlug: tenant?.slug,
      permissions: (primaryMembership?.permissions as any) || (user.role === UserRole.SUPER_ADMIN ? ['*'] : []),
    };

    const tokens = await this.generateTokens(payload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: tenant?.id,
        tenantSlug: tenant?.slug,
        businessName: tenant?.name,
        permissions: payload.permissions,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload: JwtUserPayload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'nexaflow_jwt_refresh_secret_production_ready_key_84920194',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          memberships: {
            include: { tenant: true },
          },
        },
      });

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Session expired');
      }

      const isTokenValid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const primaryMembership = user.memberships[0];
      const tenant = primaryMembership?.tenant;

      const newPayload: JwtUserPayload = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as UserRole,
        tenantId: tenant?.id,
        tenantSlug: tenant?.slug,
        permissions: (primaryMembership?.permissions as any) || (user.role === UserRole.SUPER_ADMIN ? ['*'] : []),
      };

      const tokens = await this.generateTokens(newPayload);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        },
      });

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: true,
        status: true,
        createdAt: true,
        memberships: {
          include: {
            tenant: {
              include: {
                subscription: {
                  include: {
                    plan: true,
                  },
                },
                whatsappAccount: {
                  include: {
                    phoneNumbers: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // Development sandbox OTP accepts '123456' or any valid 6-digit number
    if (dto.otp === '123456' || dto.otp.length === 6) {
      return { verified: true, message: 'OTP verified successfully' };
    }
    throw new BadRequestException('Invalid OTP. Please check the code sent to your phone/email.');
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { loggedOut: true };
  }

  private async generateTokens(payload: JwtUserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'nexaflow_jwt_access_secret_production_ready_key_98234710',
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'nexaflow_jwt_refresh_secret_production_ready_key_84920194',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400,
    };
  }
}
