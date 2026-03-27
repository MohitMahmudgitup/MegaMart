import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import stream from 'stream';
import AppError from '../errors/handleAppError';
import config from '.';



cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
})


export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  try {
    return await new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;

      // Create readable stream from buffer
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id,
          folder: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }
      );

      // Pipe buffer stream → cloudinary upload stream
      bufferStream.pipe(uploadStream);
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new AppError(401, `Error uploading file: ${error?.message}`);
  }
};


export const deleteImageFromCLoudinary = async (url: string) => {
  try {
    
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    console.log({ match });

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  } catch (error: any) {
    throw new AppError(401, 'Cloudinary image deletion failed', error.message);
  }
};


export const cloudinaryUpload = cloudinary;
