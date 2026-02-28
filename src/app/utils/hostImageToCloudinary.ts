import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import config from '../config';
import multer from 'multer';
import os from 'os';

// -------------Configuration values for cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const hostImageToCloudinary = (
  imageName: string,
  imagePath: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(imagePath)) {
      return reject(new Error('File not found for uploading to Cloudinary'));
    }
    // -------------Upload an image to cloudinary
    cloudinary.uploader.upload(
      imagePath,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Image hosted and Local file is deleted successfully.');
            }
          });
        }
      },
    );
  });
};

// -------------Configuration for multer for temporary storage and file management
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(os.tmpdir(), 'shraban_uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
