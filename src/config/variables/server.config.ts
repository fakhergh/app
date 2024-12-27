import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '@/config/config.type';
import { Environment } from '@/modules/common/types/env.type';

export default registerAs<EnvironmentVariables['server']>('server', () => ({
  env: process.env.NODE_ENV as Environment,
  port: parseInt(process.env.PORT || '9000'),
}));
