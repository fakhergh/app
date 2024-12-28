import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '../config.type';

export default registerAs<EnvironmentVariables['cloudinary']>('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}));
