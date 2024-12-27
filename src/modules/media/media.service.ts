import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import * as mime from 'mime-types';
import * as sharp from 'sharp';

import { streamToBuffer } from '@/common/utils/file.util';
import { CloudinaryService } from '@/external/cloudinary/cloudinary.service';
import { FileService } from '@/modules/file/file.service';
import {
  ALLOWED_MIME_TYPES,
  getAudioMetadataFromCloudinaryResponse,
  getDocumentMetadataFromCloudinaryResponse,
  getImageMetadataFromCloudinaryResponse,
  getVideoMetadataFromCloudinaryResponse,
  MAX_HEIGHT,
  MAX_WIDTH,
} from '@/modules/media/media.util';

@Injectable()
export class MediaService {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async resizeImage(buffer: Buffer) {
    return sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();
  }

  async upload({ mimetype, createReadStream }: FileUpload) {
    const stream = createReadStream();

    const extension = mime.extension(mimetype) as string;

    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw 'File not  supported';
    }

    const isImage = mimetype.startsWith('image');
    const isDocument = mimetype.startsWith('application');

    const resourceType = isDocument ? 'raw' : 'auto';

    const fileData = isImage ? await this.resizeImage(await streamToBuffer(stream)) : stream;

    const result = (await this.cloudinaryService.upload(fileData, extension, resourceType)) as UploadApiResponse;

    switch (result.resource_type) {
      case 'image':
        return await this.fileService.saveImage(getImageMetadataFromCloudinaryResponse(result, extension));
      case 'video':
        if (result.audio.codec) {
          return await this.fileService.saveAudio(getAudioMetadataFromCloudinaryResponse(result, extension));
        }
        return await this.fileService.saveVideo(getVideoMetadataFromCloudinaryResponse(result, extension));
      default:
        return this.fileService.saveDocument(getDocumentMetadataFromCloudinaryResponse(result, extension));
    }
  }
}
