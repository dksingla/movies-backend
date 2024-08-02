/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // Make sure this is imported
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { MoviesModule } from '../movies/movie.module';
import { jwtConstants } from './constants';
@Module({
  imports: [
    UsersModule,
    MoviesModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController], // Add this line
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}