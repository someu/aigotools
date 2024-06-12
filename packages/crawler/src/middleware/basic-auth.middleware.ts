import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.setUnauthorizedResponse(res);
      return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );
    const [username, password] = credentials.split(':');

    if (
      username &&
      password &&
      username === this.configService.get('AUTH_USER') &&
      password === this.configService.get('AUTH_PASSWORD')
    ) {
      return next();
    } else {
      this.setUnauthorizedResponse(res);
      return;
    }
  }

  private setUnauthorizedResponse(response: Response) {
    response.setHeader('WWW-Authenticate', 'Basic realm="Access to the site"');
    response.status(401).send('Unauthorized');
  }
}
