/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Type(() => Number)
  year: number;

  @IsNotEmpty()
  file: Express.Multer.File;

  @IsInt()
  @Type(() => Number)
  userId: number;
}