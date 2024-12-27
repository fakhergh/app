import { Type as ClassType } from '@nestjs/common';
import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';

@ObjectType()
class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string;
}

export class Edge<T> {
  cursor: string;
  node: T;
}

export class Connection<T> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: Edge<T>[];
}

export class Pagination<T> {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  page: number;
  limit: number;
  items: T[];
}

@ArgsType()
export class ConnectionArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  @Field(() => Int, { nullable: true })
  first?: number = 10;

  @IsOptional()
  @Field({ nullable: true })
  after?: string;
}

@ArgsType()
export class PaginationArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  @Field(() => Int, { nullable: true })
  limit?: number = 10;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  page?: number = 1;
}

export function createConnection<T>(classRef: ClassType<T>): ClassType<Connection<T>> {
  @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
  abstract class EdgeType {
    @Field()
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class ConnectionType implements Connection<T> {
    @Field(() => [EdgeType])
    edges: EdgeType[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return ConnectionType as ClassType<Connection<T>>;
}

export function createPagination<T>(classRef: ClassType<T>): ClassType<Pagination<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginationType implements Pagination<T> {
    @Field(() => Int)
    totalCount: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    currentPage: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => [classRef])
    items: T[];
  }

  return PaginationType as ClassType<Pagination<T>>;
}

export function createInput<T>(classRef: ClassType<T>) {
  @InputType()
  abstract class InputOptionsType {
    @ValidateNested()
    @Type(() => classRef)
    @Field(() => classRef, { nullable: true })
    filter?: T;
  }

  return InputOptionsType;
}
