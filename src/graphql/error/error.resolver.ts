import { Query, Resolver } from '@nestjs/graphql';

import { ResponseError } from './error.type';

@Resolver()
export class ErrorResolver {
  @Query(() => ResponseError, { nullable: true })
  errors() {
    return null;
  }
}
