import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis as IORedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  readonly redisClient: IORedisClient;
  constructor(private configService: ConfigService) {
    this.redisClient = new IORedisClient({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      retryStrategy: () => 10000,
      maxRetriesPerRequest: Number.MAX_SAFE_INTEGER,
      password: configService.get('REDIS_PASS'),
      db: configService.get('REDIS_DB'),
    });
  }

  onModuleInit() {
    this.logRedisLifeCycle('RedisService', this.redisClient);
  }

  private logRedisLifeCycle(name: string, client: IORedisClient) {
    if (client.status === 'ready') {
      Logger.log('Redis is ready');
    }

    client.on('ready', () => {
      Logger.log('Redis is ready');
    });

    client.on('connect', () => {
      Logger.log('Redis connected');
    });

    client.on('reconnecting', () => {
      Logger.log('Redis reconnecting');
    });

    client.on('error', (error) => {
      Logger.error(`Redis error: ${error}`);
    });

    client.on('end', () => {
      Logger.log('Redis connection closed');
    });
  }
}
