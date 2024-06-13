import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private bucket: string;
  private bucketExist = false;
  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: configService.get('MINIO_ENDPOINT'),
      port: parseInt(configService.get('MINIO_PORT'), 10),
      useSSL: configService.get('MINIO_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECERT_KEY'),
    });
    this.bucket = configService.get('MINIO_BUCKET', 'aigotools');
  }

  async ensureBucketExist() {
    if (this.bucketExist) {
      return;
    }
    const bucket = this.bucket;
    const exists = await this.minioClient.bucketExists(bucket);
    if (exists) {
      Logger.log(`Bucket ${bucket} exists.`);
    } else {
      await this.minioClient.makeBucket(bucket);
      Logger.log(`Bucket ${bucket} created.`);
    }
    this.bucketExist = true;
  }

  async uploadFile(buffer: Buffer, contentType: string) {
    await this.ensureBucketExist();
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
