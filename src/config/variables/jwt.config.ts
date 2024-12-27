import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '@/config/config.type';

export default registerAs<EnvironmentVariables['jwt']>('jwt', () => ({
  accessTokenSecretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
}));
