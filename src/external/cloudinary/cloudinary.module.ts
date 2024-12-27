import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryProvider } from '@/external/cloudinary/cloudinary.provider';
import { CloudinaryService } from '@/external/cloudinary/cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
