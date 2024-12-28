import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryModule } from '../../external/cloudinary/cloudinary.module';
import { FileModule } from '../file/file.module';
import { MediaService } from './media.service';

@Module({
  imports: [ConfigModule, FileModule, CloudinaryModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
