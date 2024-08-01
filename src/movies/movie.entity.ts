/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class Movie {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => Int)
  @Column()
  year: number;

  @Field()
  @Column()
  jpgFilePath: string; // This will store the path to the uploaded file

  @Field(() => [User])
  @ManyToMany(() => User, user => user.movies)
  users: User[];
}