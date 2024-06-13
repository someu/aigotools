import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { MongooseModule } from '@nestjs/mongoose';
import { SITE_QUEUE_NAME } from './site-queue.constant';
import { SiteConsumer } from './site-queue.consumer';
import { SiteQueueProducer } from './site-queue.producer';
import { Site, SiteSchema } from '../schemas/site.schema';
import { BrowserService } from '../providers/browser.service';
import { S3Service } from '../providers/s3.service';
import { ConfigService } from '@nestjs/config';
import { Category, CategorySchema } from '../schemas/category.schema';
import { RedisService } from '../providers/redis.service';
import { MinioService } from '../providers/minio.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: SITE_QUEUE_NAME,
    }),
    BullBoardModule.forFeature({
      name: SITE_QUEUE_NAME,
      adapter: BullAdapter,
    }),
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [
    SiteConsumer,
    SiteQueueProducer,
    BrowserService,
    S3Service,
    ConfigService,
    RedisService,
    MinioService,
  ],
  exports: [SiteQueueProducer],
})
export class SiteQueueModule {}
