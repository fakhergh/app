import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '@/graphql/error/error.type';

export class CustomerNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CUSTOMER_NOT_FOUND);
  }
}

export class CustomerDuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CUSTOMER_DUPLICATION);
  }
}

export class CustomerVerificationError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CUSTOMER_ALREADY_VERIFIED);
  }
}
