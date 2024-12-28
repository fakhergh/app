import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { Category } from './category.schema';
import { CategoryFilterInput, CategoryInput, CreateCategoryInput, UpdateCategoryInput } from './category.type';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  name: { type: FieldType.STRING, overrideFieldName: 'name.en' },
  parentId: { type: FieldType.ID },
  parentPath: { type: FieldType.STRING },
  path: { type: FieldType.STRING },
  showOnTop: { type: FieldType.BOOLEAN },
  active: { type: FieldType.BOOLEAN },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
  deleted: { type: FieldType.BOOLEAN },
};

@Injectable()
export class CategoryService extends FieldService<Category> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {
    super(filterConfigOptions);
  }

  async getCategoriesCount() {
    const filter: FilterQuery<Category> = { deleted: { $ne: true } };

    return this.categoryModel.countDocuments(filter);
  }

  async getCategories(input: CategoryInput = {}) {
    const filter: FilterQuery<Category> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);

    const sortOptions: { [key: string]: SortOrder } = { showOnTop: 'desc', position: 'asc' };

    return this.categoryModel.find(filter).sort(sortOptions);
  }

  async getCategoriesByIds(ids: Array<Types.ObjectId | string>) {
    const filter: FilterQuery<Category> = { _id: { $in: ids }, deleted: { $ne: true } };

    return this.categoryModel.find(filter);
  }

  async getCategory(inputFilter: CategoryFilterInput) {
    const filter = this.configureFilters(
      {},
      {
        ...inputFilter,
        deleted: { ne: true },
      },
    );

    return this.categoryModel.findOne(filter);
  }

  async getCategoryBySlug(slug: string) {
    const filter = { deleted: { $ne: true }, slug };
    return this.categoryModel.findOne(filter);
  }

  async createCategory(data: CreateCategoryInput & { parentPath?: string; path: string; slug: string }) {
    return this.categoryModel.create(data);
  }

  async updateCategory({ id, ...data }: UpdateCategoryInput) {
    const filter = { _id: id };
    const update = { $set: data };
    const options = { new: true };

    return this.categoryModel.findOneAndUpdate(filter, update, options);
  }

  async deleteCategory(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };

    return this.categoryModel.findOneAndUpdate(filter, update, options);
  }

  async setCategoryActive(id: string, active: boolean) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active } };
    const options = { new: true };

    return this.categoryModel.findOneAndUpdate(filter, update, options);
  }

  async setCategoryShowOnTop(id: string, showOnTop: boolean) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { showOnTop } };
    const options = { new: true };

    return this.categoryModel.findOneAndUpdate(filter, update, options);
  }

  async sortCategories(ids: Array<string | Types.ObjectId>) {
    const operations = ids.map((id: string, position: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position } },
      },
    }));

    return this.categoryModel.bulkWrite(operations);
  }
}
