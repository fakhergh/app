import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '@/common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '@/modules/common/services/field.service';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { Feedback } from '@/modules/feedback/feedback.schema';
import { CreateFeedbackInput, FeedbackPaginationInput } from '@/modules/feedback/feedback.type';

export interface CreateFeedbackData extends CreateFeedbackInput {
  customer?: Types.ObjectId;
  serviceProvider?: Types.ObjectId;
}

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  title: { type: FieldType.STRING },
  pinned: { type: FieldType.BOOLEAN },
  customer: { type: FieldType.ID },
  serviceProvider: { type: FieldType.ID },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
};

@Injectable()
export class FeedbackService extends FieldService<Feedback> {
  constructor(@InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>) {
    super(filterConfigOptions);
  }

  createFeedback(input: CreateFeedbackData) {
    return this.feedbackModel.create(input);
  }

  deleteFeedback(id: Types.ObjectId | string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };

    return this.feedbackModel.findOneAndUpdate(filter, update, options);
  }

  updateFeedbackPinStatus(id: Types.ObjectId | string, pinned: boolean) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { pinned } };
    const options = { new: true };

    return this.feedbackModel.findOneAndUpdate(filter, update, options);
  }

  async getFeedbacksOffsetPagination(paginationArgs: PaginationArgs | null, input: FeedbackPaginationInput) {
    const filter: FilterQuery<Feedback> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.feedbackModel.countDocuments(countFilter),
      this.feedbackModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }
}
