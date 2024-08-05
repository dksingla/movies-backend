/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { UsersModule } from '../users/users.module';
import { MoviesController } from './movie.controller'; // Import the controller
import { MovieResolver } from './movie.resolver';

// movies.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Movie]), UsersModule],
  providers: [MoviesService, MovieResolver], // Include MovieResolver here
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}