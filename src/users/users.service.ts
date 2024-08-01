/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Movie } from '../movies/movie.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email }, relations: ['movies'] });
  }

  async addMovieToUser(userId: number, movieId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId }, relations: ['movies'] });
    const movie = await this.moviesRepository.findOne({ where: { id: movieId } });

    if (user && movie) {
      user.movies.push(movie);
      return this.usersRepository.save(user);
    }

    throw new Error('User or Movie not found');
  }
}