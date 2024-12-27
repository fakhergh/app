import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryModule } from '@/external/cloudinary/cloudinary.module';
import { FileModule } from '@/modules/file/file.module';
import { MediaService } from '@/modules/media/media.service';

@Module({
  imports: [FileModule, ConfigModule, CloudinaryModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
