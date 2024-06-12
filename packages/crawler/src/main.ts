import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = parseInt(configService.get('PORT'), 10) || 3000;
  await app.listen(port);
  const apiUrl = await app.getUrl();

  Logger.log('>>>>>>>>>>>>>>>>>>>> start');
  Logger.log(`>>>>>>>>>>>>>>>>>>>> server running on ${apiUrl}`);
}
bootstrap();
