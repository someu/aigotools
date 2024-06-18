import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { v4 } from 'uuid';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private bucket: string;
  constructor(private configService: ConfigService) {
    this.bucket = configService.get('MINIO_BUCKET', '');
    if (configService.get('IMAGE_STORAGE') === 'minio') {
      this.minioClient = new Client({
        endPoint: configService.get('MINIO_ENDPOINT', ''),
        port: parseInt(configService.get('MINIO_PORT'), 10),
        useSSL: configService.get('MINIO_SSL') === 'true',
        accessKey: configService.get('MINIO_ACCESS_KEY', ''),
        secretKey: configService.get('MINIO_SECERT_KEY', ''),
      });
      this.ensureBucketExist();
    }
  }

  async ensureBucketExist() {
    const bucket = this.bucket;
    const exists = await this.minioClient.bucketExists(bucket);
    if (exists) {
      Logger.log(`Bucket ${bucket} exists.`);
    } else {
      await this.minioClient.makeBucket(bucket);
      Logger.log(`Bucket ${bucket} created.`);
    }
  }

  async uploadFile(buffer: Buffer, contentType: string) {
    const subfix = contentType.split('/').pop();
    const fileKey = subfix ? `${v4()}.${subfix}` : v4();

    await this.minioClient.putObject(
      this.bucket,
      fileKey,
      buffer,
      buffer.length,
      {
        'Content-Type': contentType,
      },
    );
    return `${this.configService.get('MINIO_BASE')}/${this.bucket}/${fileKey}`;
  }
}
