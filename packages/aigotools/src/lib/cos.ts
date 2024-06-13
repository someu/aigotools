"use server";
import COS from "cos-nodejs-sdk-v5";
import { v4 } from "uuid";

import { AppConfig } from "./config";

const cos = new COS({
  SecretId: AppConfig.cosSecertId,
  SecretKey: AppConfig.cosSecertKey,
});

export async function uploadBufferToCos(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const subfix = contentType.split("/").pop();
  const fileKey = subfix ? `${v4()}.${subfix}` : v4();

  try {
    await cos.putObject({
      Bucket: AppConfig.cosBucket,
      Region: AppConfig.cosRegion,
      Key: fileKey,
      Body: buffer,
    });

    return `${AppConfig.cosBase}/${fileKey}`;
  } catch (error) {
    console.error("Error uploading file to COS:", error);
    throw new Error("Failed to upload file to COS");
  }
}

export async function uploadFormDataToCos(formData: FormData) {
  const files = formData.getAll("files") as File[];

  const uploadRes = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return uploadBufferToCos(buffer, file.type);
    })
  );

  return uploadRes;
}
