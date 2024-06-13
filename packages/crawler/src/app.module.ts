import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicAuthMiddleware } from './middleware/basic-auth.middleware';
import { Site, SiteSchema } from './schemas/site.schema';
import { SiteQueueModule } from './site-queue/site-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.prod', '.env.dev', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    BullModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          redis: {
            db: configService.get('REDIS_DB'),
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASS'),
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    BullBoardModule.forRootAsync({
      useFactory() {
        return {
          route: '/queues',
          adapter: ExpressAdapter,
          middleware: BasicAuthMiddleware,
        };
      },
      imports: [ConfigModule],
    }),
    SiteQueueModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 1000,
        limit: 10,
      },
      {
        ttl: 10 * 1000,
        limit: 50,
      },
      {
        ttl: 60 * 1000,
        limit: 200,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes('/');
  }
}
