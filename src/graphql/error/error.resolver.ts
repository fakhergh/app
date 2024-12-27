import { Query, Resolver } from '@nestjs/graphql';

import { ResponseError } from '@/graphql/error/error.type';

@Resolver()
export class ErrorResolver {
  @Query(() => ResponseError, { nullable: true })
  errors() {
    return null;
  }
}
