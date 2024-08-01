/* eslint-disable prettier/prettier */
// auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse) // You'll need to create this type
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.signIn(email, password);
  }
}

// Add this type definition
import { ObjectType, Field } from '@nestjs/graphql';
import { Movie } from '../movies/movie.entity';

@ObjectType()
class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => [Movie])
  movies: Movie[];
}