import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

import { validate } from '@/config/config.validation';
import authConfig from '@/config/variables/auth';
import cloudinaryConfig from '@/config/variables/cloudinary.config';
import databaseConfig from '@/config/variables/database.config';
import googleSignInConfig from '@/config/variables/google-sign-in';
import jwtConfig from '@/config/variables/jwt.config';
import mailerConfig from '@/config/variables/mailer.config';
import serverConfig from '@/config/variables/server.config';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [authConfig, googleSignInConfig, serverConfig, jwtConfig, cloudinaryConfig, databaseConfig, mailerConfig],
      validate,
    }),
  ],
})
export class ConfigModule {}
