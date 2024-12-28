import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { RequestUser } from '@/modules/common/types/auth.type';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { UserType } from '@/modules/common/types/user.type';
import { Customer } from '@/modules/customer/customer.schema';
import { CustomerService } from '@/modules/customer/customer.service';
import { Feedback, FeedbackDocument } from '@/modules/feedback/feedback.schema';
import {
  CreateFeedbackInput,
  DeleteFeedbackInput,
  FeedbackPagination,
  FeedbackPaginationInput,
  PinFeedbackInput,
  UnPinFeedbackInput,
} from '@/modules/feedback/feedback.type';
import { ServiceProvider } from '@/modules/service-provider/service-provider.schema';
import { ServiceProviderService } from '@/modules/service-provider/service-provider.service';

import { CreateFeedbackData, FeedbackService } from './feedback.service';

@Resolver(() => Feedback)
export class FeedbackResolver extends NodeResolver<Feedback> {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly customerService: CustomerService,
    private readonly serviceProviderService: ServiceProviderService,
  ) {
    super();
  }

  @HasRole(UserType.CUSTOMER, UserType.SERVICE_PROVIDER)
  @Mutation(() => Feedback)
  createFeedback(@Args('input') input: CreateFeedbackInput, @CurrentUser() user: RequestUser) {
    const data: CreateFeedbackData = { ...input };

    switch (user.userType) {
      case UserType.CUSTOMER:
        data.customer = user._id;
        break;
      case UserType.SERVICE_PROVIDER:
        data.serviceProvider = user._id;
        break;
    }

    return this.feedbackService.createFeedback(data);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.FEEDBACK.READ)
  @Query(() => FeedbackPagination)
  feedbacksPagination(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: FeedbackPaginationInput = {},
  ) {
    return this.feedbackService.getFeedbacksOffsetPagination(paginationArgs, input);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.FEEDBACK.DELETE)
  @Mutation(() => Feedback)
  deleteFeedback(@Args('input') input: DeleteFeedbackInput) {
    return this.feedbackService.deleteFeedback(input.id);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.FEEDBACK.UPDATE)
  @Mutation(() => Feedback)
  pinFeedback(@Args('input') input: PinFeedbackInput) {
    return this.feedbackService.updateFeedbackPinStatus(input.id, true);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.FEEDBACK.UPDATE)
  @Mutation(() => Feedback)
  unpinFeedback(@Args('input') input: UnPinFeedbackInput) {
    return this.feedbackService.updateFeedbackPinStatus(input.id, false);
  }

  @ResolveField(() => Customer, { nullable: true })
  customer(@Root() feedback: FeedbackDocument) {
    return feedback.customer ? this.customerService.getCustomerById(feedback.customer) : null;
  }

  @ResolveField(() => ServiceProvider, { nullable: true })
  serviceProvider(@Root() feedback: FeedbackDocument) {
    return feedback.serviceProvider
      ? this.serviceProviderService.getServiceProvider({ id: { eq: feedback.serviceProvider.toString() } })
      : null;
  }
}
