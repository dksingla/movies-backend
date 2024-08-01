/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { UsersModule } from '../users/users.module';
import { MovieResolver } from './movie.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), UsersModule],
  providers: [MoviesService, MovieResolver],
  exports: [MoviesService],
})
export class MoviesModule {}
