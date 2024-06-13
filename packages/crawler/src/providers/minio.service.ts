import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private bucket: string;
  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: configService.get('MINIO_ENDPOINT'),
      port: parseInt(configService.get('MINIO_PORT'), 10),
      useSSL: configService.get('MINIO_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECERT_KEY'),
    });
    this.bucket = configService.get('MINIO_BUCKET', 'aigotools');
    this.ensureBucketExist();
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
    return `${this.bucket}/${fileKey}`;
  }

  async getFileStream(filePath: string) {
    const [stat, stream] = await Promise.all([
      await this.minioClient.statObject(this.bucket, filePath),
      await this.minioClient.getObject(this.bucket, filePath),
    ]);
    return {
      stat,
      stream,
    };
  }
}
