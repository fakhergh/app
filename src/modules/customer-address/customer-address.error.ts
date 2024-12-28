import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class CustomerAddressNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.CUSTOMER_ADDRESS_NOT_FOUND);
  }
}
