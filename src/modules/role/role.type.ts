import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import {
  BooleanFilterInput,
  DateFilterInput,
  EnumFilterInput,
  StringFilterInput,
} from '@/modules/common/types/filter.type';
import { createInput, createPagination } from '@/modules/common/types/query.type';
import { Role, RoleType } from '@/modules/role/role.schema';

registerEnumType(RoleType, { name: 'RoleType' });

@ObjectType()
export class RolePagination extends createPagination(Role) {}

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field(() => RoleType)
  type: RoleType;

  @Field(() => [String])
  permissions: Array<string>;
}

@InputType()
export class UpdateRoleInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => RoleType, { nullable: true })
  type: RoleType;

  @Field(() => [String], { nullable: true })
  permissions: Array<string>;
}

@InputType()
export class DeleteRoleInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class EnableRoleInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class DisableRoleInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class RoleFilterInput {
  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @ValidateNested()
  @Type(() => RoleEnumFilterInput)
  @IsOptional()
  @Field(() => RoleEnumFilterInput, { nullable: true })
  type?: RoleType;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  permission?: StringFilterInput;

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
export class RolePaginationInput extends createInput(RoleFilterInput) {}

@InputType()
export class RoleEnumFilterInput extends EnumFilterInput<RoleType>(RoleType, 'RoleType') {}
