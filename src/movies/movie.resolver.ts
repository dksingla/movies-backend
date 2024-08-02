/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
// import { UseInterceptors, UploadedFile } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Express } from 'express';

@ObjectType()
class MoviePaginatedResponse {
    @Field(() => [Movie])
    movies: Movie[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    totalPages: number;
}

@Resolver(() => Movie)
export class MovieResolver {
    constructor(private moviesService: MoviesService) { }

    @Query(() => MoviePaginatedResponse)
    async getmovies(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    ) {
        return this.moviesService.findAll(page);
    }

    @Query(() => Movie)
    async getmovie(@Args('id', { type: () => Int }) id: number) {
        return this.moviesService.findOne(id);
    }

    @Mutation(() => Movie)
    async createMovie(
        @Args('title') title: string,
        @Args('year', { type: () => Int }) year: number,
        @Args('link') link: string,
        @Args('userId', { type: () => Int }) userId: number,
        // @Context('req') req: any
    ) {
        // const user = req.user;
        return this.moviesService.create(title, year, link, userId);
    }
    @Mutation(() => Movie)
    async editMovie(
        @Args('id', { type: () => Int }) id: number,
        @Args('title', { nullable: true }) title?: string,
        @Args('year', { type: () => Int, nullable: true }) year?: number,
        @Args('link', { nullable: true }) link?: string,
    ): Promise<Movie> {
        return this.moviesService.edit(id, title, year, link);
    }
}