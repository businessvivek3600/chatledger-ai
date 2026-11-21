import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService Integration Test', () => {
  let authService: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock_jwt_token_sample'),
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'test_user_id' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should authenticate seeded super admin user with valid credentials', async () => {
    const result = await authService.login({
      email: 'admin@nexaflow.ai',
      password: 'AdminPassword123!',
    });

    expect(result).toBeDefined();
    expect(result.user.email).toBe('admin@nexaflow.ai');
    expect(result.accessToken).toBe('mock_jwt_token_sample');
  });

  it('should reject login with incorrect password', async () => {
    await expect(
      authService.login({
        email: 'admin@nexaflow.ai',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should verify sandbox OTP code 123456', async () => {
    const res = await authService.verifyOtp({
      phoneOrEmail: '+919820123456',
      otp: '123456',
    });
    expect(res.verified).toBe(true);
  });
});
