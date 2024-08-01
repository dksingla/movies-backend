/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private usersService: UsersService, // Inject UsersService
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { id } });
  }

  async create(title: string, year: number, jpgFile: Express.Multer.File, userId: number): Promise<Movie> {
    const uniqueFilename = `${Date.now()}-${jpgFile.originalname}`;
    const filePath = path.join(__dirname, '..', '..', 'uploads', uniqueFilename);
  
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, jpgFile.buffer, async (err) => {
        if (err) {
          reject(err);
        } else {
          const movie = this.moviesRepository.create({
            title,
            year,
            jpgFilePath: `/uploads/${uniqueFilename}`
          });
          const savedMovie = await this.moviesRepository.save(movie);
          
          // Associate the movie with the user
          await this.usersService.addMovieToUser(userId, savedMovie.id);
          
          resolve(savedMovie);
        }
      });
    });
  }
}
