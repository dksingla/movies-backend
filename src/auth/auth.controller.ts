/* eslint-disable prettier/prettier */
// auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto'; // Import the DTO
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true })) // Enable validation pipes
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      // Call signIn from AuthService
      const { access_token, total, id } = await this.authService.signIn(signInDto.email, signInDto.password);

      

      
      return res.json({ total, id , access_token });
    } catch (error) {
      // Handle errors from AuthService
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message || 'Login failed', // Provide error message
      });
    }
  }
}