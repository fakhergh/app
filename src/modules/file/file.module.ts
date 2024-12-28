import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { File, FileSchema } from '../file/file.schema';
import { FileService } from '../file/file.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
