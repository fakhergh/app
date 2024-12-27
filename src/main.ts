import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.use(
    graphqlUploadExpress({ maxFileSize: 10_000_000 /*10mb*/ /*maxFiles: 5*/ }),
  );

  await app.listen(9000);
}
bootstrap();
