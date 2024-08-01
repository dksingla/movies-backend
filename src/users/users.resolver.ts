/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  async user(@Args('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Mutation(() => User)
  async addMovieToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('movieId', { type: () => Int }) movieId: number,
  ) {
    return this.usersService.addMovieToUser(userId, movieId);
  }
}