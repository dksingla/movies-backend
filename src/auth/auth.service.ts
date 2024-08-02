/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MoviesService } from '../movies/movie.service'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private moviesService: MoviesService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string, total: number ,id:number}> {
    const user = await this.usersService.findOne(email);

    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials'); // Provide more context in the exception
    }
    
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const id = user.userId
    const payload = { sub: user.userId, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
  
    // Fetch movies for the user
    const {  total } = await this.moviesService.findAll(1); // Get the first page of movies

    return {
      access_token,
      total,
      id
    };
  }
}