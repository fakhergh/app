import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '../config.type';

export default registerAs<EnvironmentVariables['database']>('database', () => ({
  uri: process.env.MONGO_DB_DSN,
}));
