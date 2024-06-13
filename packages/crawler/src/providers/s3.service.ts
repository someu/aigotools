import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

@Injectable()
export class S3Service {
  s3: S3Client;
  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: configService.get('S3_REGION'),
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('S3_ACCESS_SECERT'),
      },
    });
  }

  async uploadBufferToS3(
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    const subfix = contentType.split('/').pop();
    const fileKey = subfix ? `${v4()}.${subfix}` : v4();
    const params: PutObjectCommandInput = {
      Bucket: this.configService.get('S3_BUCKET'),
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3.send(command);

      return `${this.configService.get('S3_BASE')}/${fileKey}`;
    } catch (error) {
      Logger.error('Error uploading file to S3', error);
      throw error;
    }
  }
}
