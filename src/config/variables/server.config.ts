import { registerAs } from '@nestjs/config';

import { Environment } from '../../modules/common/types/env.type';
import { EnvironmentVariables } from '../config.type';

export default registerAs<EnvironmentVariables['server']>('server', () => ({
  env: process.env.NODE_ENV as Environment,
  port: parseInt(process.env.PORT || '9000'),
}));
