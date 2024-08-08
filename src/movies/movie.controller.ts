/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Param,
    Put,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @Post('create')
@UseInterceptors(FileInterceptor('file'))
async createMovie(
    @Body('title') title: string,
    @Body('year') year: number,
    @Body('userId') userId: number,
    @UploadedFile() file: Express.Multer.File, // Expecting the uploaded file here
): Promise<Movie> {
    if (!file) {
        throw new BadRequestException('File must be provided');
    }

    // Check file type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only JPG, PNG, and GIF are allowed.');
    }

    // Check file size
    const maxSizeInBytes = 500 * 1024; // 500 KB
    if (file.size > maxSizeInBytes) {
        throw new BadRequestException('File size exceeds the limit of 500 KB.');
    }

    return this.moviesService.create(title, year, file, userId);
}

@Put(':id/update')
@UseInterceptors(FileInterceptor('file'))
async editMovie(
    @Param('id') id: number,
    @Body('title') title?: string,
    @Body('year') year?: number,
    @UploadedFile() file?: Express.Multer.File, // Expecting the uploaded file here
): Promise<Movie> {
    if (file) {
        // Check file type
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPG, PNG, and GIF are allowed.');
        }

        // Check file size
        const maxSizeInBytes = 500 * 1024; // 500 KB
        if (file.size > maxSizeInBytes) {
            throw new BadRequestException('File size exceeds the limit of 500 KB.');
        }
    }

    return this.moviesService.edit(id, title, year, file); // Pass the file only if it exists
}
}