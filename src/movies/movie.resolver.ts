/* eslint-disable prettier/prettier */
import { Resolver, Query, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';

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
    constructor(private moviesService: MoviesService) {}

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
}