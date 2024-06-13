"use server";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 } from "uuid";

import { AppConfig } from "./config";

const s3 = new S3Client({
  region: AppConfig.s3Region,
  credentials: {
    accessKeyId: AppConfig.s3AccessKey as string,
    secretAccessKey: AppConfig.s3Secert as string,
  },
});

export async function uploadBufferToS3(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const subfix = contentType.split("/").pop();
  const fileKey = subfix ? `${v4()}.${subfix}` : v4();
  const params: PutObjectCommandInput = {
    Bucket: AppConfig.s3Bucket,
    Key: fileKey,
    Body: buffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);

    return `${AppConfig.s3Base}/${fileKey}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export async function uploadFormDataToS3(formData: FormData) {
  const files = formData.getAll("files") as File[];

  const uploadRes = await Promise.all(
    files.map(async (file) => {
      const buffer = (await file.arrayBuffer()) as Buffer;

      return uploadBufferToS3(buffer, file.type);
    })
  );

  return uploadRes;
}
