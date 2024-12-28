import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

import { Environment } from '../modules/common/types/env.type';

class EnvironmentVariablesValidation {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGO_DB_DSN: string;

  @IsNotEmpty()
  @IsString()
  CLOUDINARY_CLOUD_NAME: string;

  @IsNotEmpty()
  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  CLOUDINARY_API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  NO_REPLY_MAILER_HOST: string;

  @IsNumber()
  @IsNotIn([0])
  NO_REPLY_MAILER_PORT: number;

  @IsBoolean()
  NO_REPLY_MAILER_SECURE: boolean;

  @IsEmail()
  NO_REPLY_MAILER_USER: string;

  @IsNotEmpty()
  @IsString()
  NO_REPLY_MAILER_PASS: string;

  @IsNotEmpty()
  @IsString()
  NO_REPLY_MAILER_FROM: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_TOKEN_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_TOKEN_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  ADMIN_RESET_PASSWORD_URL: string;

  @IsNotEmpty()
  @IsString()
  TWO_FACTOR_AUTHENTICATION_ENCRYPTION_KEY: string;

  @IsOptional()
  @IsNumber()
  PASSWORD_HASH_SALT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariablesValidation, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipNullProperties: false,
    skipUndefinedProperties: false,
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
