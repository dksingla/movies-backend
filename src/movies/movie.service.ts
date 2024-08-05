/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique file names


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

  async create(title: string, year: number, file: Express.Multer.File, userId: number): Promise<Movie> {
    const jpgFilePath = await this.saveFile(file); 

    // Extract just the filename using string manipulation
    const filename = jpgFilePath.split('/').pop() || jpgFilePath; 

    const movie = this.moviesRepository.create({
      title,
      year,
      jpgFilePath: filename,
    });

    const savedMovie = await this.moviesRepository.save(movie);

    // Associate the movie with the user
    await this.usersService.addMovieToUser(userId, savedMovie.id);

    return savedMovie;
  }

  async edit(id: number, title?: string, year?: number, file?: Express.Multer.File): Promise<Movie> {
    const movie = await this.findOne(id);
    const filePath = await this.saveFile(file); 
    const filename = filePath.split('/').pop() || filePath; 

    if (title !== undefined) {
      movie.title = title;
    }
    if (year !== undefined) {
      movie.year = year;
    }
    if (file) {
      movie.jpgFilePath = filename
    }

    return this.moviesRepository.save(movie);
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Define the upload directory
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create uploads directory if it does not exist
    }

    const fileName = `${uuidv4()}-${file.originalname}`; // Generate a unique file name
    const filePath = path.join(uploadDir, fileName); // Create the full path for the file

    try {
      fs.writeFileSync(filePath, file.buffer); // Write the file to the filesystem
      return `/uploads/${fileName}`; // Return the relative URL to the saved file
    } catch (error) {
      throw new InternalServerErrorException('Could not save the file'); // Handle any errors
    }
}
}