import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import {
  BooleanFilterInput,
  DateFilterInput,
  EnumFilterInput,
  IDFilterInput,
  StringFilterInput,
} from '@/modules/common/types/filter.type';
import { createInput, createPagination } from '@/modules/common/types/query.type';
import { Permission, PermissionAction, PermissionType } from '@/modules/permission/permission.schema';

registerEnumType(PermissionAction, { name: 'PermissionAction' });

registerEnumType(PermissionType, { name: 'PermissionType' });

@ObjectType()
export class PermissionPagination extends createPagination(Permission) {}

@InputType()
export class CreatePermissionInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(PermissionType)
  @Field(() => PermissionType)
  type: PermissionType;

  @IsNotEmpty()
  @IsEnum(PermissionAction)
  @Field(() => PermissionAction)
  action: string;
}

@InputType()
export class UpdatePermissionInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;

  @IsOptional()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(PermissionType)
  @Field(() => PermissionType)
  type: PermissionType;

  @IsNotEmpty()
  @IsEnum(PermissionAction)
  @Field(() => PermissionAction)
  action: PermissionAction;
}

@InputType()
export class DeletePermissionInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class EnablePermissionInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class DisablePermissionInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class PermissionActionFilterInput extends EnumFilterInput(PermissionAction, 'PermissionAction') {}

@InputType()
export class PermissionTypeFilterInput extends EnumFilterInput(PermissionType, 'PermissionType') {}

@InputType()
export class PermissionFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id: IDFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  name: StringFilterInput;

  @ValidateNested()
  @Type(() => PermissionActionFilterInput)
  @IsOptional()
  @Field(() => PermissionActionFilterInput, { nullable: true })
  action: PermissionActionFilterInput;

  @ValidateNested()
  @Type(() => PermissionTypeFilterInput)
  @IsOptional()
  @Field(() => PermissionTypeFilterInput, { nullable: true })
  type: PermissionTypeFilterInput;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  active: BooleanFilterInput;

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
export class PermissionPaginationInput extends createInput(PermissionFilterInput) {}
