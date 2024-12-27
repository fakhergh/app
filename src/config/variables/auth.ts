import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '@/config/config.type';

export default registerAs<EnvironmentVariables['auth']>('auth', () => ({
  twoFactorEncryptionKey: process.env.TWO_FACTOR_AUTHENTICATION_ENCRYPTION_KEY, //32 byte or 256 bits only
}));
