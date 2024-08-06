/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { UsersService } from '../users/users.service';
import cloudinary from '../config/config.module'// Import Cloudinary

@Injectable()
export class MoviesService {
 
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private usersService: UsersService,
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
    const jpgFilePath = await this.uploadFileToCloudinary(file); // Upload to Cloudinary

    const movie = this.moviesRepository.create({
        title,
        year,
        jpgFilePath: jpgFilePath, // Store the Cloudinary URL
    });

    const savedMovie = await this.moviesRepository.save(movie);
    // Associate the movie with the user
    await this.usersService.addMovieToUser(userId, savedMovie.id);

    return savedMovie;
}


  async edit(id: number, title?: string, year?: number, file?: Express.Multer.File): Promise<Movie> {
    const movie = await this.findOne(id);

    if (file) {
      const filePath = await this.uploadFileToCloudinary(file); // Upload new file to Cloudinary
      movie.jpgFilePath = filePath; // Update with Cloudinary URL
    }

    if (title !== undefined) {
      movie.title = title; // Update title if provided
    }
    if (year !== undefined) {
      movie.year = year; // Update year if provided
    }

    return this.moviesRepository.save(movie); // Save updated movie
  }

  private async uploadFileToCloudinary(file: Express.Multer.File): Promise<string> {
    try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error); // Log the error
                        return reject(error); // Reject the promise
                    }
                    resolve(result); // Resolve the promise with the result
                }
            );
            stream.end(file.buffer); // End the stream with the file buffer
        });

        return uploadResult.secure_url; // Return the secure URL of the uploaded file
    } catch (error) {
        console.error('Error in uploadFileToCloudinary:', error); // Log the error for debugging
        throw new InternalServerErrorException('Could not upload the file to Cloudinary');
    }
}
}