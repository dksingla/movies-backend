/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Movie } from '../movies/movie.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  userId: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(() => [Movie])
  @ManyToMany(() => Movie, movie => movie.users)
  @JoinTable()
  movies: Movie[];
}