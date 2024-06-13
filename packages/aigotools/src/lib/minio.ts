"use server";
import { v4 } from "uuid";
import { Client } from "minio";
import sharp from "sharp";

import { AppConfig } from "./config";

const minioClient = new Client({
  endPoint: AppConfig.minioEndPoint,
  port: AppConfig.minioPort,
  useSSL: AppConfig.minioUseSSL,
  accessKey: AppConfig.minioAccessKey,
  secretKey: AppConfig.minioSecretKey,
});

export async function uploadBufferToMinio(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const exists = await minioClient.bucketExists(AppConfig.minioBucket);

  if (!exists) {
    await minioClient.makeBucket(AppConfig.minioBucket);
    console.log(`Create minio bucket: ${AppConfig.minioBucket}`);
  }

  const subfix = contentType.split("/").pop();
  const fileKey = subfix ? `${v4()}.${subfix}` : v4();

  try {
    await minioClient.putObject(
      AppConfig.minioBucket,
      fileKey,
      buffer,
      buffer.length,
      {
        "Content-Type": contentType,
      }
    );

    return `${AppConfig.minioBase}/${AppConfig.minioBucket}/${fileKey}`;
  } catch (error) {
    console.error("Failed to upload file to minio", error);
    throw new Error("Failed to upload file to minio");
  }
}

export async function uploadFormDataToMinio(formData: FormData) {
  const files = formData.getAll("files") as File[];

  const uploadRes = await Promise.all(
    files.map(async (file) => {
      const buffer = await sharp(await file.arrayBuffer())
        .toFormat("webp")
        .toBuffer();

      return uploadBufferToMinio(buffer, "image/webp");
    })
  );

  return uploadRes;
}
