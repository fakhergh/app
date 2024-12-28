import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '../../graphql/error/error.type';

export class BookingNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.BOOKING_NOT_FOUND);
  }
}
