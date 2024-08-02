/* eslint-disable prettier/prettier */
// src/auth/dto/signin.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
