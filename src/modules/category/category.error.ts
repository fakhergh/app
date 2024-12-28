import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class CategoryNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CATEGORY_NOT_FOUND);
  }
}

export class CategoryDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CATEGORY_DUPLICATION);
  }
}
