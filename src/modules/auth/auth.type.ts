import { createUnionType, Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { Admin } from '../admin/admin.schema';
import { AuthProvider } from '../common/types/auth.type';
import { UserType } from '../common/types/user.type';
import { Customer } from '../customer/customer.schema';
import { ServiceProvider } from '../service-provider/service-provider.schema';

export enum SignInType {
  BASIC = 'BASIC',
  TWO_FACTOR = 'TWO_FACTOR',
}

registerEnumType(SignInType, {
  name: 'SignInType',
});

export interface JwtPayload {
  id: string;
  userType: UserType;
  authProvider?: AuthProvider;
  exp?: number;
  iat?: number;
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenId: string;
}

@ObjectType({ isAbstract: true })
class BaseSignIn {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class AdminBasicSignIn extends BaseSignIn {
  @Field(() => SignInType)
  type: SignInType;

  @Field(() => Admin)
  admin: Admin;
}

@ObjectType()
export class AdminVerifySignIn extends BaseSignIn {
  @Field(() => Admin)
  admin: Admin;
}

@ObjectType()
export class AdminTwoFactorSignIn {
  @Field(() => SignInType)
  type: SignInType;

  @Field(() => String)
  token: string;
}

const AdminSignInTypeKey: Record<SignInType, 'AdminBasicSignIn' | 'AdminTwoFactorSignIn'> = {
  [SignInType.BASIC]: 'AdminBasicSignIn',
  [SignInType.TWO_FACTOR]: 'AdminTwoFactorSignIn',
};

export const AdminSignIn = createUnionType({
  name: 'AdminSignIn',
  types: () => [AdminBasicSignIn, AdminTwoFactorSignIn] as const,
  resolveType: (args) => {
    return AdminSignInTypeKey[args.type];
  },
});

@ObjectType()
export class ServiceProviderSignUp extends BaseSignIn {
  @Field(() => ServiceProvider)
  serviceProvider: ServiceProvider;
}

@ObjectType()
export class SignIn extends BaseSignIn {}

@ObjectType()
export class ServiceProviderSignIn extends BaseSignIn {
  @Field(() => ServiceProvider)
  serviceProvider: ServiceProvider;
}

@ObjectType()
export class CustomerSignIn extends BaseSignIn {
  @Field(() => Customer)
  customer: Customer;
}

@ObjectType()
export class CustomerSignUp {
  @Field()
  email: string;
}

@ObjectType()
export class CustomerVerifyForgotPassword {
  @Field()
  email: string;

  @Field()
  code: string;
}

@ObjectType()
export class CustomerForgotPassword {
  @Field()
  email: string;
}

@ObjectType()
export class AdminGenerateTwoFactorSecret {
  @Field()
  secret: string;

  @Field()
  qrCodeUrl: string;
}

@ObjectType()
export class AdminRefreshToken extends BaseSignIn {}

@ObjectType()
export class AdminForgotPassword {
  @Field()
  token: string;
}

@InputType()
export class AdminEnableTwoFactorInput {
  @Field()
  code: string;
}

@InputType()
export class AdminDisableTwoFactorInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class AdminChangePasswordInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class AdminSignInInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}

@InputType()
export class AdminVerifySignInInput {
  @Length(6, 6)
  @IsString()
  @Field()
  code: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  token: string;
}

@InputType()
export class AdminForgotPasswordInput {
  @IsEmail()
  @Field()
  email: string;
}

@InputType()
export class AdminResetPasswordInput {
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class ServiceProviderSignInInput {
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class ServiceProviderSignUpInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class CustomerGoogleSignInInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  idToken: string;
}

@InputType()
export class CustomerAppleSignInInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  nonce: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  idToken: string;
}

@InputType()
export class CustomerSignInInput {
  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class CustomerSignUpInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class CustomerVerifySignUpInput {
  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @Length(6, 6)
  @IsString()
  @Field()
  code: string;
}

@InputType()
export class CustomerForgotPasswordInput {
  @IsEmail()
  @IsString()
  @Field()
  email: string;
}

@InputType()
export class CustomerVerifyForgotPasswordInput {
  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;
}

@InputType()
export class CustomerResetPasswordInput {
  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class AdminRefreshTokenInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  refreshToken: string;
}
