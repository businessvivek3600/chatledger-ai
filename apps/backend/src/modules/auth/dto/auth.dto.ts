import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IndustryType } from '@nexaflow/shared-types';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsOptional()
  industry?: IndustryType;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phoneOrEmail: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
