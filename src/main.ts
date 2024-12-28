import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { PermissionsGuard } from './common/guards/permission.guard';
import { RoleGuard } from './common/guards/role.guard';
import { EnvironmentVariables } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<EnvironmentVariables['server']>('server').port;
  const reflector = app.get(Reflector);

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
  app.useGlobalGuards(new RoleGuard(reflector), new PermissionsGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000 /*10mb*/ /*maxFiles: 5*/ }));

  await app.listen(port || 9000);
}
bootstrap();
