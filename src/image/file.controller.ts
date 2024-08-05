/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Param,
    Res,
  } from '@nestjs/common';
  import { createReadStream} from 'fs';
  import { join} from 'path';
  import type { Response } from 'express';
  
  @Controller('image')
  export class FileController {
    @Get(':filename')
    async getImageFile(
      @Param('filename') filename: string,
      @Res() res: Response,
    ) {
      const filePath = join(process.cwd(),'uploads', filename); // Path to uploads directory
      console.log("file path",filePath)
      const fileStream = createReadStream(filePath);
      console.log("stream",fileStream)
      fileStream.pipe(res) 
  
    }
  }