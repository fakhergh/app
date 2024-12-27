import { ApolloError } from 'apollo-server-express';

import { ResponseError } from '@/graphql/error/error.type';

export class UnauthenticatedError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.UNAUTHENTICATED);
  }
}

export class UnauthorizedError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.UNAUTHORIZED);
  }
}

export class InvalidCredentialsError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.INVALID_CREDENTIALS);
  }
}

export class InvalidOTPError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.INVALID_OTP);
  }
}

export class TwoFactorAuthenticationEnabledError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.TWO_FACTOR_AUTHENTICATION_ENABLED);
  }
}

export class TwoFactorAuthenticationDisabledError extends ApolloError {
  constructor(message: string) {
    super(message, ResponseError.TWO_FACTOR_AUTHENTICATION_DISABLED);
  }
}
