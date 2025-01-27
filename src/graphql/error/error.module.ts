import { Module } from '@nestjs/common';

import { ErrorResolver } from './error.resolver';

@Module({
  providers: [ErrorResolver],
})
export class ErrorModule {}
