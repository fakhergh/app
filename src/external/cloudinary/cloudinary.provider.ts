import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { EnvironmentVariables } from '@/config/config.type';

export const CloudinaryProvider = {
  imports: [ConfigModule],
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    const config = configService.get<EnvironmentVariables['cloudinary']>('cloudinary');

    return cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
  },
  inject: [ConfigService],
};
