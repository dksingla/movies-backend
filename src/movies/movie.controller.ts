/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Param,
    Put,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
  import { MoviesService } from './movie.service';
  import { ParseFilePipeBuilder } from '@nestjs/common';
  import { Movie } from './movie.entity';
  
  @Controller('movies')
  export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}
  
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createMovie(
      @Body('title') title: string,
      @Body('year') year: number,
      @Body('userId') userId: number,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(jpg|jpeg|png|gif)$/,
          })
          .addMaxSizeValidator({ maxSize: 3000000 })
          .build({
            errorHttpStatusCode: 400,
          }),
      )
      file: Express.Multer.File,
    ): Promise<Movie> {
      return this.moviesService.create(title, year, file, userId);
    }
  
    @Put(':id/update')
    @UseInterceptors(FileInterceptor('file'))
    async editMovie(
      @Param('id') id: number,
      @Body('title') title?: string,
      @Body('year') year?: number,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(jpg|jpeg|png|gif)$/, // Allow common image types
          })
          .addMaxSizeValidator({ maxSize: 3000000 }) // Limit to 1MB
          .build({
            errorHttpStatusCode: 400, // Customize error status code
          }),
      )
      file?: Express.Multer.File,
    ): Promise<Movie> {
      return this.moviesService.edit(id, title, year, file);
    }
  }