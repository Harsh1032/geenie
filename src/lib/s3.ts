// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(fileBuffer: Buffer, filename: string, mimetype: string) {
  const Key = `${uuidv4()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.CUSTOM_AWS_BUCKET_NAME!,
    Key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  await s3.send(command);
  return `https://${process.env.CUSTOM_AWS_BUCKET_NAME}.s3.${process.env.CUSTOM_AWS_REGION}.amazonaws.com/${Key}`;
}
