import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '@/graphql/error/error.type';

export class AdminNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.ADMIN_NOT_FOUND);
  }
}

export class AdminDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.ADMIN_DUPLICATION);
  }
}

export class ResetPasswordInvalidInputError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.INVALID_INPUT);
  }
}
