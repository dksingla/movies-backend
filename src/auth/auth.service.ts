/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MoviesService } from '../movies/movie.service';
import { Movie } from '../movies/movie.entity'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private moviesService: MoviesService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string, movies: Movie[] }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
  
    // Fetch movies for the user
    const movies = await this.moviesService.findAll(); // Assuming this returns an array of Movie objects
  
    return {
      access_token,
      movies,
    };
  }
}