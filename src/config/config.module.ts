import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

import { validate } from './config.validation';
import authConfig from './variables/auth';
import cloudinaryConfig from './variables/cloudinary.config';
import databaseConfig from './variables/database.config';
import googleSignInConfig from './variables/google-sign-in';
import jwtConfig from './variables/jwt.config';
import mailerConfig from './variables/mailer.config';
import serverConfig from './variables/server.config';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [authConfig, googleSignInConfig, serverConfig, jwtConfig, cloudinaryConfig, databaseConfig, mailerConfig],
      validate,
    }),
  ],
})
export class ConfigModule {}
