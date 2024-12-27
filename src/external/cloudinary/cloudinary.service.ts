import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ReadStream } from 'fs-capacitor';

@Injectable()
export class CloudinaryService {
  async upload(
    data: ReadStream | Buffer,
    format: string,
    resource_type?: 'image' | 'video' | 'raw' | 'auto',
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: resource_type ?? 'auto', format, folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      if (Buffer.isBuffer(data)) {
        upload.end(data);
      } else {
        data.pipe(upload);
      }
    });
  }
}
