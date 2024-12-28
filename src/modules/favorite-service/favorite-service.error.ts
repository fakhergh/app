import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class FavoriteServiceNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.FAVORITE_SERVICE_NOT_FOUND);
  }
}

export class FavoriteServiceDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.FAVORITE_SERVICE_DUPLICATION);
  }
}
