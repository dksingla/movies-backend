/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private usersService: UsersService, // Inject UsersService
  ) {}

  async findAll(page: number = 1): Promise<{ movies: Movie[], total: number, totalPages: number }> {
    const take = 8;
    const skip = (page - 1) * take;

    const [movies, total] = await this.moviesRepository.findAndCount({
      skip,
      take,
      order: { id: 'ASC' },
      
    });

    const totalPages = Math.ceil(total / take);

    return { movies, total, totalPages };
  }

  async findOne(id: number): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { id } });
  }

  async create(title: string, year: number, jpgLink: string, userId: number): Promise<Movie> {
    const movie = this.moviesRepository.create({
        title,
        year,
        jpgFilePath: jpgLink
    });
    const savedMovie = await this.moviesRepository.save(movie);
    
    // Associate the movie with the user
    await this.usersService.addMovieToUser(userId, savedMovie.id);
    
    return savedMovie;
}
async edit(id: number, title: string, year: number, jpgLink: string): Promise<Movie> {
    const movie = await this.findOne(id);
    
    if (title !== undefined) {
        movie.title = title;
      }
      if (year !== undefined) {
        movie.year = year;
      }
      if (jpgLink !== undefined) {
        movie.jpgFilePath = jpgLink;
      }

    return this.moviesRepository.save(movie);
  }
}
