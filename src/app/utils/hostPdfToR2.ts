import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import fs from 'fs';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.r2_account_id}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2_access_key_id as string,
    secretAccessKey: config.r2_secret_access_key as string,
  },
});

export const hostPdfToR2 = async (
  fileName: string,
  filePath: string,
  contentType: string = 'application/pdf',
): Promise<string> => {
  if (!fs.existsSync(filePath)) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'File not found for uploading to R2',
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: config.r2_bucket_name,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Construct the public URL
  const publicUrl = `${config.r2_public_url}/${fileName}`;

  // Delete local file after upload
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting local PDF file:', err);
      } else {
        console.log('PDF hosted on R2 and Local file is deleted successfully.');
      }
    });
  }

  return publicUrl;
};
