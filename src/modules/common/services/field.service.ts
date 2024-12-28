import { FilterQuery, Types } from 'mongoose';

import {
  BooleanFilterInput,
  DateFilterInput,
  FloatFilterInput,
  IDFilterInput,
  IntFilterInput,
  LocationFilterInput,
  StringFilterInput,
} from '../types/filter.type';

interface Filter {
  apply(query: Record<string, any>): Record<string, any>;
}

type LocationFilterConfigOption = {
  type: FieldType.LOCATION;
  overrideFieldName?: string;
  locationType: 'Point';
  maxDistance?: number;
  minDistance?: number;
};

type FilterConfigOption = { type: FieldType; overrideFieldName?: string } | LocationFilterConfigOption;

export type FilterConfigOptions = Record<string, FilterConfigOption>;

enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum FieldType {
  ID,
  STRING,
  INT,
  FLOAT,
  BOOLEAN,
  LOCATION,
  DATE,
  ENUM,
}

class IDFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: IDFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (this.filterValue.eq) query[fieldName] = { $eq: new Types.ObjectId(this.filterValue.eq) };
    if (this.filterValue.ne) query[fieldName] = { $ne: new Types.ObjectId(this.filterValue.ne) };
    if (this.filterValue.gt) query[fieldName] = { $gt: new Types.ObjectId(this.filterValue.gt) };
    if (this.filterValue.gte) query[fieldName] = { $gte: new Types.ObjectId(this.filterValue.gte) };
    if (this.filterValue.lt) query[fieldName] = { $lt: new Types.ObjectId(this.filterValue.lt) };
    if (this.filterValue.lte) query[fieldName] = { $lte: new Types.ObjectId(this.filterValue.lte) };
    if (Array.isArray(this.filterValue.between)) {
      query[fieldName] = {
        $in: this.filterValue.between.map((id) => new Types.ObjectId(id)),
      };
    }
    return query;
  }
}

class StringFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: StringFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (this.filterValue.eq) query[fieldName] = { $eq: this.filterValue.eq };
    if (this.filterValue.ne) query[fieldName] = { $ne: this.filterValue.ne };
    if (Array.isArray(this.filterValue.between)) query[fieldName] = { $in: this.filterValue.between };
    if (this.filterValue.beginsWith) {
      query[fieldName] = {
        $regex: new RegExp(`^${this.filterValue.beginsWith}`, 'i'),
      };
    }
    if (this.filterValue.notContains) {
      query[fieldName] = { $not: new RegExp(`.*${this.filterValue.notContains}.*`, 'i') };
    }
    if (this.filterValue.contains) {
      query[fieldName] = { $regex: new RegExp(`.*${this.filterValue.contains}.*`, 'i') };
    }
    return query;
  }
}

class BooleanFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: BooleanFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (typeof this.filterValue.eq === 'boolean') query[fieldName] = { $eq: this.filterValue.eq };
    if (typeof this.filterValue.ne === 'boolean') query[fieldName] = { $ne: this.filterValue.ne };
    return query;
  }
}

class IntFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: IntFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (typeof this.filterValue.eq === 'number') query[fieldName] = { $eq: this.filterValue.eq };
    if (typeof this.filterValue.ne === 'number') query[fieldName] = { $ne: this.filterValue.ne };
    if (typeof this.filterValue.gt === 'number') query[fieldName] = { $gt: this.filterValue.gt };
    if (typeof this.filterValue.gte === 'number') query[fieldName] = { $gte: this.filterValue.gte };
    if (typeof this.filterValue.lt === 'number') query[fieldName] = { $lt: this.filterValue.lt };
    if (typeof this.filterValue.lte === 'number') query[fieldName] = { $lte: this.filterValue.lte };
    if (Array.isArray(this.filterValue.between)) query[fieldName] = { $in: this.filterValue.between };
    return query;
  }
}

class FloatFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: FloatFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (typeof this.filterValue.eq === 'number') query[fieldName] = { $eq: this.filterValue.eq };
    if (typeof this.filterValue.ne === 'number') query[fieldName] = { $ne: this.filterValue.ne };
    if (typeof this.filterValue.gt === 'number') query[fieldName] = { $gt: this.filterValue.gt };
    if (typeof this.filterValue.gte === 'number') query[fieldName] = { $gte: this.filterValue.gte };
    if (typeof this.filterValue.lt === 'number') query[fieldName] = { $lt: this.filterValue.lt };
    if (typeof this.filterValue.lte === 'number') query[fieldName] = { $lte: this.filterValue.lte };
    if (Array.isArray(this.filterValue.between)) query[fieldName] = { $in: this.filterValue.between };
    return query;
  }
}

class DateFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: DateFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (this.filterValue.eq) query[fieldName] = { $eq: this.filterValue.eq };
    if (this.filterValue.ne) query[fieldName] = { $ne: this.filterValue.ne };
    if (this.filterValue.gt) query[fieldName] = { $gt: this.filterValue.gt };
    if (this.filterValue.gte) query[fieldName] = { $gte: this.filterValue.gte };
    if (this.filterValue.lt) query[fieldName] = { $lt: this.filterValue.lt };
    if (this.filterValue.lte) query[fieldName] = { $lte: this.filterValue.lte };
    if (Array.isArray(this.filterValue.between)) {
      query[fieldName] = { $gte: this.filterValue.between[0], $lte: this.filterValue.between[1] };
    }
    return query;
  }
}

class EnumFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: StringFilterInput,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (this.filterValue.eq) query[fieldName] = { $eq: this.filterValue.eq };
    if (this.filterValue.ne) query[fieldName] = { $ne: this.filterValue.ne };
    if (Array.isArray(this.filterValue.between)) query[fieldName] = { $in: this.filterValue.between };

    return query;
  }
}

class LocationFilter implements Filter {
  constructor(
    private field: string,
    private filterValue: LocationFilterInput,
    private aggregation: boolean,
    private locationType: 'Point',
    private minDistance?: number,
    private maxDistance?: number,
  ) {}

  apply(query: Record<string, any>): Record<string, any> {
    const fieldName = this.field;
    if (this.filterValue.near) {
      //const pipelineStage = {};
      if (this.aggregation) {
      } else {
        query[fieldName] = {
          $near: {
            $geometry: {
              type: this.locationType,
              coordinates: [this.filterValue.near.longitude, this.filterValue.near.latitude],
            },
          },
        };
        if (typeof this.minDistance === 'number') query[fieldName].$near.$minDistance = this.minDistance;
        if (typeof this.maxDistance === 'number') query[fieldName].$near.$maxDistance = this.maxDistance;
      }
    }

    return query;
  }
}

class CompositeFilter implements Filter {
  private filters: Filter[] = [];

  addFilter(filter: Filter): void {
    this.filters.push(filter);
  }

  apply(query: Record<string, any>): Record<string, any> {
    for (const filter of this.filters) {
      filter.apply(query);
    }
    return query;
  }
}

export class FieldService<T> {
  private readonly config: FilterConfigOptions;

  constructor(config: FilterConfigOptions = {}) {
    this.config = config;
  }

  private addFieldFilter(compositeFilter: CompositeFilter, field: string, filterValue: any, option?: any) {
    if (!this.config[field]) return;

    const fieldName = this.config[field].overrideFieldName ?? field;

    switch (this.config[field].type) {
      case FieldType.ID:
        compositeFilter.addFilter(new IDFilter(fieldName, filterValue));
        break;
      case FieldType.STRING:
        compositeFilter.addFilter(new StringFilter(fieldName, filterValue));
        break;
      case FieldType.BOOLEAN:
        compositeFilter.addFilter(new BooleanFilter(fieldName, filterValue));
        break;
      case FieldType.INT:
        compositeFilter.addFilter(new IntFilter(fieldName, filterValue));
        break;
      case FieldType.FLOAT:
        compositeFilter.addFilter(new FloatFilter(fieldName, filterValue));
        break;
      case FieldType.DATE:
        compositeFilter.addFilter(new DateFilter(fieldName, filterValue));
        break;
      case FieldType.ENUM:
        compositeFilter.addFilter(new EnumFilter(fieldName, filterValue));
        break;
      case FieldType.LOCATION:
        const locationFilterConfigOptions = option as LocationFilterConfigOption;

        compositeFilter.addFilter(
          new LocationFilter(
            fieldName,
            filterValue,
            true,
            locationFilterConfigOptions.locationType,
            locationFilterConfigOptions.minDistance,
            locationFilterConfigOptions.maxDistance,
          ),
        );
        break;
    }
  }

  protected configureFilters(query: FilterQuery<T>, filter: Record<string, any>): FilterQuery<T> {
    const compositeFilter = new CompositeFilter();

    if (!filter) return query;

    if (Array.isArray(filter.AND) && filter.AND.length) {
      query.$and = filter.AND.reduce((prev, curr) => {
        Object.keys(curr).forEach((key) => {
          if (key !== LogicalOperator.AND && key !== LogicalOperator.OR) {
            this.addFieldFilter(compositeFilter, key, curr[key], this.config[key]);
          }
        });
        return prev;
      }, {});
    }

    if (Array.isArray(filter.OR) && filter.OR.length) {
      query.$or = filter.OR.reduce((prev, curr) => {
        Object.keys(curr).forEach((key) => {
          if (key !== LogicalOperator.AND && key !== LogicalOperator.OR) {
            this.addFieldFilter(compositeFilter, key, curr[key], this.config[key]);
          }
        });
        return prev;
      }, {});
    }

    Object.keys(filter).forEach((key) => {
      if (key !== LogicalOperator.AND && key !== LogicalOperator.OR)
        this.addFieldFilter(compositeFilter, key, filter[key], this.config[key]);
    });

    return compositeFilter.apply(query);
  }
}
