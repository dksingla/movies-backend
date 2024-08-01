/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolver';
import { User } from './user.entity';
import { Movie } from '../movies/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie])],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
})
export class UsersModule {}