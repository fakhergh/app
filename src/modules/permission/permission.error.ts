import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class PermissionNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.PERMISSION_NOT_FOUND);
  }
}

export class PermissionDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.PERMISSION_DUPLICATION);
  }
}
