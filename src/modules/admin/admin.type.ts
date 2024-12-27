import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Admin } from '@/modules/admin/admin.schema';
import {
  BooleanFilterInput,
  DateFilterInput,
  IDFilterInput,
  StringFilterInput,
} from '@/modules/common/types/filter.type';
import { createInput, createPagination } from '@/modules/common/types/query.type';

@ObjectType()
export class AdminPagination extends createPagination(Admin) {}

@InputType()
export class CreateAdminInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @Field(() => [String])
  roles: string[];
}

@InputType()
export class UpdateAdminInput {
  @IsNotEmpty()
  @IsMongoId()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @Field(() => [String])
  roles: string[];
}

@InputType()
export class DeleteAdminInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class EnableAdminInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class DisableAdminInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class SendAdminResetPasswordLinkInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateAdminProfileInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
}

@InputType()
export class AdminFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  email?: StringFilterInput;

  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  role?: IDFilterInput;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  active?: BooleanFilterInput;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  createdAt?: DateFilterInput;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  updatedAt?: DateFilterInput;
}

@InputType()
export class AdminPaginationInput extends createInput(AdminFilterInput) {}
