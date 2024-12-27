import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '@/graphql/error/error.type';

export class ServiceProviderNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.SERVICE_PROVIDER_NOT_FOUND);
  }
}

export class ServiceProviderDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.SERVICE_PROVIDER_DUPLICATION);
  }
}
