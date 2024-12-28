import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<EnvironmentVariables['server']>('server').port;

  app.use(
    morgan('dev', {
      stream: {
        write: function (str) {
          Logger.log(str, 'Request');
        },
      },
    }),
  );

  app.enableCors();
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000 /*10mb*/ /*maxFiles: 5*/ }));

  await app.listen(port || 9000);
}
bootstrap();
