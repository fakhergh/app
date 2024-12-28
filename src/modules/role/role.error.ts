import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class RoleNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.ROLE_NOT_FOUND);
  }
}

export class RoleDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.ROLE_DUPLICATION);
  }
}
