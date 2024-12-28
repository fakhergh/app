import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvironmentVariables } from '../config/config.type';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<EnvironmentVariables['database']>('database').uri,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
