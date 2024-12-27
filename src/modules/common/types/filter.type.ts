import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEnum, IsInt, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export function EnumFilterInput<T>(enumRef: Record<string, T>, name: string) {
  @InputType(`${name}EnumFilterInput`, { isAbstract: true })
  abstract class EnumFilterInputType {
    @IsOptional()
    @IsEnum(enumRef)
    @Field(() => enumRef, { nullable: true })
    ne?: string;

    @IsOptional()
    @IsEnum(enumRef)
    @Field(() => enumRef, { nullable: true })
    eq?: string;

    @IsOptional()
    @IsEnum(enumRef, { each: true })
    @Field(() => [enumRef], { nullable: true })
    between?: [string, string];
  }

  return EnumFilterInputType;
}

@InputType()
export class IDFilterInput {
  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  ne?: string;

  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  eq?: string;

  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  lte?: string;

  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  lt?: string;

  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  gte?: string;

  @Field({ nullable: true })
  gt?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  @Field(() => [String], { nullable: true })
  between?: [string, string];
}

@InputType()
export class StringFilterInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  ne?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  eq?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  contains?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  notContains?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  beginsWith?: string;

  @IsOptional()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  between?: [string, string];
}

@InputType()
export class IntFilterInput {
  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  ne?: number;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  eq?: number;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  lte?: number;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  lt?: number;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  gte?: number;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  gt?: number;

  @IsOptional()
  @IsInt({ each: true })
  @Field(() => [Int], { nullable: true })
  between?: [number, number];
}

@InputType()
export class FloatFilterInput {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  ne?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  eq?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  lte?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  lt?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  gte?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  gt?: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Field(() => [Float], { nullable: true })
  between?: [number, number];
}

@InputType()
export class BooleanFilterInput {
  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  ne?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  eq?: boolean;
}

@InputType()
export class DateFilterInput {
  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  eq?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  ne?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  lte?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  lt?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  gte?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  gt?: Date;

  @IsOptional()
  @IsDate({ each: true })
  @Field(() => [Date], { nullable: true })
  between?: [Date, Date];
}

@InputType()
class LocationCoordinatesInput {
  @IsNumber()
  @Field(() => Number)
  latitude: number;

  @IsNumber()
  @Field(() => Number)
  longitude: number;
}

@InputType()
export class LocationFilterInput {
  @IsOptional() // Allow null or undefined
  @Field(() => LocationCoordinatesInput, { nullable: true })
  near?: LocationCoordinatesInput;
}
