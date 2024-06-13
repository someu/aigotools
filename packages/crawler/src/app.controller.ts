import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService, BatchParams } from './app.service';
import { MinioService } from './providers/minio.service';
import { Response } from 'express';
import { error } from 'console';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  @Post('dispatch')
  async batchDispatchSites(@Body() body: BatchParams) {
    const count = await this.appService.batchDispatchSiteCrawl(body);
    return count;
  }

  @Post('stop')
  async batchStopSites(@Body() body: BatchParams) {
    const count = await this.appService.batchStopSiteCrawl(body);
    return count;
  }

  @Get('image/:file')
  async getImage(@Param('file') file: string, @Res() res: Response) {
    const { stat, stream } = await this.minioService.getFileStream(file);
    stream.on('data', (chunk) => {
      res.write(chunk, 'binary');
    });
    res.set({
      'Content-Type': stat.metaData['content-type'],
    });
    stream.on('end', () => {
      res.end();
    });
    stream.on('error', () => {
      Logger.error(`Get file ${file} error: ${error}`);
      throw new Error('Get file error');
    });
  }
}
