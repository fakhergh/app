import { Field, ID as Id, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';

import { BooleanFilterInput, DateFilterInput, IDFilterInput, StringFilterInput } from '../common/types/filter.type';
import { createInput } from '../common/types/query.type';

@InputType()
export class CategoryFilterInput {
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  @Field(() => IDFilterInput, { nullable: true })
  parentId?: IDFilterInput;

  @Field(() => BooleanFilterInput, { nullable: true })
  showOnTop?: BooleanFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  parentPath?: StringFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  path?: StringFilterInput;

  @Field(() => BooleanFilterInput, { nullable: true })
  active?: BooleanFilterInput;

  @Field(() => DateFilterInput, { nullable: true })
  createdAt?: DateFilterInput;

  @Field(() => DateFilterInput, { nullable: true })
  updatedAt?: DateFilterInput;
}

@InputType()
export class CategoryNameInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  en: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  ar: string;
}

@InputType()
export class CreateCategoryInput {
  @IsOptional()
  @IsMongoId()
  @Field(() => Id, { nullable: true })
  parentId?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => CategoryNameInput)
  @Field(() => CategoryNameInput)
  name: CategoryNameInput;

  @Matches(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  @IsString()
  @Field()
  icon: string;
}

@InputType()
export class UpdateCategoryInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => CategoryNameInput)
  @Field(() => CategoryNameInput, { nullable: true })
  name?: CategoryNameInput;

  @Matches(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  @IsString()
  @Field()
  icon: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}

@InputType()
export class DeleteCategoryInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class EnableCategoryInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class DisableCategoryInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class EnableCategoryShowOnTopInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class DisableCategoryShowOnTopInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class SortCategoriesInput {
  @IsMongoId({ each: true })
  @Field(() => [Id])
  ids: Array<string>;
}

@InputType()
export class CategoryInput extends createInput<CategoryFilterInput>(CategoryFilterInput) {}
