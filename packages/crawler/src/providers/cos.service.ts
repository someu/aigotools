import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as COS from 'cos-nodejs-sdk-v5';

import { v4 } from 'uuid';

@Injectable()
export class COSService {
  cos: COS;
  constructor(private configService: ConfigService) {
    this.cos = new COS({
      SecretId: configService.get('COS_SECERT_ID'),
      SecretKey: configService.get('COS_SECERT_KEY'),
    });
  }

  async uploadBufferToCOS(
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const subfix = contentType.split('/').pop();
    const fileKey = subfix ? `${v4()}.${subfix}` : v4();

    try {
      await this.cos.putObject({
        Bucket: this.configService.get('COS_BUCKET'),
        Region: this.configService.get('COS_REGION'),
        Key: fileKey,
        Body: buffer,
      });
      return `${this.configService.get('COS_BASE')}/${fileKey}`;
    } catch (error) {
      Logger.error('Error uploading file to S3', error);
      throw error;
    }
  }
}
