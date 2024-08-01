/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Resolver(() => Movie)
export class MovieResolver {
    constructor(private moviesService: MoviesService) { }

    @Query(() => [Movie])
    async getmovies() {
        return this.moviesService.findAll();
    }

    @Query(() => Movie)
    async getmovie(@Args('id', { type: () => Int }) id: number) {
        return this.moviesService.findOne(id);
    }

    @Mutation(() => Movie)
    @UseInterceptors(FileInterceptor('jpgFile', {
        limits: {
            fileSize: 5000000, // 5MB
        },
    }))
    async createMovie(
        @Args('title') title: string,
        @Args('year', { type: () => Int }) year: number,
        @UploadedFile() jpgFile: Express.Multer.File, // Use the Express.Multer.File type
        @Context('req') req: any // To access the authenticated user
    ) {
        const user = req.user;
        return this.moviesService.create(title, year, jpgFile, user.userId);
    }
}