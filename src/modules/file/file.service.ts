import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { File, FileDocument } from '../file/file.schema';
import { CreateAudioDto, CreateImageDto, CreateVideoDto } from '../file/file.type';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  saveImage(data: CreateImageDto) {
    return this.fileModel.create({ ...data, type: 'image' });
  }

  saveAudio(data: CreateAudioDto) {
    return this.fileModel.create({ ...data, type: 'audio' });
  }

  saveVideo(data: CreateVideoDto) {
    return this.fileModel.create({ ...data, type: 'video' });
  }

  saveDocument(data: any) {
    return this.fileModel.create({ ...data, type: 'application' });
  }
}
