import { Module } from '@nestjs/common';

import { ErrorResolver } from '@/graphql/error/error.resolver';

@Module({
  providers: [ErrorResolver],
})
export class ErrorModule {}
