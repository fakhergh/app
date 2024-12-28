import { Args, Int, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { DateTime } from 'luxon';

// Import custom decorators, errors, schemas, services, and types
import { HasRole } from '../../common/decorators/has-role.decorator';
import { HasPermission } from '../../common/decorators/permission.decorator';
import { CurrentUser } from '../../common/directives/current-user.directive';
import { BookingHistoryStatusType } from '../booking-history/booking-history.schema';
import { BookingHistoryService } from '../booking-history/booking-history.service';
import { BookingHistoryConnection } from '../booking-history/booking-history.type';
import { Category } from '../category/category.schema';
import { CategoryService } from '../category/category.service';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { RequestUser } from '../common/types/auth.type';
import { PERMISSIONS } from '../common/types/permission.type';
import { ConnectionArgs } from '../common/types/query.type';
import { UserType } from '../common/types/user.type';
import { ConversationService, CreateConversationData } from '../conversation/conversation.service';
import { Customer } from '../customer/customer.schema';
import { CustomerService } from '../customer/customer.service';
import { CustomerAddress } from '../customer-address/customer-address.schema';
import { CustomerAddressService } from '../customer-address/customer-address.service';
import { CreateBookingHistoryMessageData, MessageService } from '../message/message.service';
import { ServiceProviderNotFoundError } from '../service-provider/service-provider.error';
import { ServiceProvider } from '../service-provider/service-provider.schema';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { ServiceProviderFilterInput } from '../service-provider/service-provider.type';
import { BookingNotFoundError } from './booking.error';
import { Booking } from './booking.schema';
import { BookingService } from './booking.service';
import {
  AcceptBookingInput,
  BookingConnection,
  BookingConnectionInput,
  BookingCountByCategory,
  CancelBookingInput,
  CreateBookingInput,
  UpdateBookingInput,
} from './booking.type';

// Resolver for the Booking entity
@Resolver(() => Booking)
export class BookingResolver extends NodeResolver<Booking> {
  constructor(
    private readonly bookingService: BookingService,
    private readonly customerService: CustomerService,
    private readonly serviceProviderService: ServiceProviderService,
    private readonly bookingHistoryService: BookingHistoryService,
    private readonly categoryService: CategoryService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly customerAddressService: CustomerAddressService,
  ) {
    super();
  }

  // Query: Get the total count of bookings (Admin only)
  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.BOOKING.READ)
  @Query(() => Int)
  async bookingsCount() {
    return this.bookingService.getBookingsCount();
  }

  // Query: Get a paginated list of bookings based on user role
  @HasRole(UserType.ADMIN, UserType.SERVICE_PROVIDER, UserType.CUSTOMER)
  @HasPermission(PERMISSIONS.BOOKING.READ)
  @Query(() => BookingConnection)
  async bookingsConnection(
    @CurrentUser() currentUser: RequestUser,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: BookingConnectionInput = {},
  ) {
    const filter = { ...input.filter };

    // Apply role-specific filters
    switch (currentUser.userType) {
      case UserType.SERVICE_PROVIDER:
        filter.serviceProviderId = { eq: (currentUser as ServiceProvider)._id.toString() };
        break;
      case UserType.CUSTOMER:
        filter.customerId = { eq: (currentUser as Customer)._id.toString() };
        break;
    }

    return this.bookingService.getPaginatedBookings(connectionArgs, { ...input, filter });
  }

  // Query: Get a single booking based on user role
  @HasRole(UserType.ADMIN, UserType.SERVICE_PROVIDER, UserType.CUSTOMER)
  @HasPermission(PERMISSIONS.BOOKING.READ)
  @Query(() => Booking, { nullable: true })
  async booking(
    @CurrentUser() currentUser: RequestUser,
    @Args('input', { nullable: true }) input: BookingConnectionInput = {},
  ) {
    const filter = { ...input.filter };

    // Apply role-specific filters
    switch (currentUser.userType) {
      case UserType.SERVICE_PROVIDER:
        filter.serviceProviderId = { eq: (currentUser as ServiceProvider)._id.toString() };
        break;
      case UserType.CUSTOMER:
        filter.customerId = { eq: (currentUser as Customer)._id.toString() };
        break;
    }

    return this.bookingService.getBooking(filter);
  }

  // Query: Get booking count categorized by specific criteria (Admin only)
  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.BOOKING.READ)
  @Query(() => [BookingCountByCategory])
  async bookingCountByCategory() {
    return this.bookingService.getBookingCountByCategory();
  }

  // Mutation: Create a booking (Customer only)
  @HasRole(UserType.CUSTOMER)
  @Mutation(() => Booking)
  async createBooking(@CurrentUser() currentUser: RequestUser, @Args('input') input: CreateBookingInput) {
    const customerId = (currentUser as Customer)._id;
    const filterInput: ServiceProviderFilterInput = { id: { eq: input.serviceProviderId } };

    // Verify service provider availability
    const serviceProvider = await this.serviceProviderService.getServiceProvider(filterInput);

    if (!serviceProvider || !serviceProvider.active)
      throw new ServiceProviderNotFoundError('Service provider not found');

    // Create the booking
    const booking = await this.bookingService.createBooking({ ...input, customerId });

    // Log booking history with initial status
    const metadata = new Map();
    metadata.set('dateTime', booking.dateTime.toISOString());

    const bookingHistory = await this.bookingHistoryService.createBookingHistory({
      bookingId: booking._id,
      status: BookingHistoryStatusType.PENDING,
      metadata,
    });

    // Create a conversation if it doesn't already exist
    let conversation = await this.conversationService.getConversation({
      customerId: { eq: customerId.toString() },
      serviceProviderId: { eq: serviceProvider._id.toString() },
      archived: { ne: true },
      bookingId: { eq: null },
    });

    if (!conversation) {
      const conversationData: CreateConversationData = {
        bookingId: booking._id,
        serviceProviderId: serviceProvider._id,
        customerId,
      };
      conversation = await this.conversationService.createConversation(conversationData);
    }

    // Add a message to the booking's history
    const orderHistoryMessageData: CreateBookingHistoryMessageData = {
      bookingHistoryId: bookingHistory._id,
      conversationId: conversation._id,
      senderId: customerId,
      senderType: UserType.CUSTOMER,
    };

    await this.messageService.createBookingHistoryMessage(orderHistoryMessageData);

    // TODO: Send push notifications and fire subscriptions
    return booking;
  }

  // Mutation: Update a booking (Customer only)
  @HasRole(UserType.CUSTOMER)
  async updateBooking(@CurrentUser() currentUser: RequestUser, @Args('input') input: UpdateBookingInput) {
    const customerId = (currentUser as Customer)._id;

    const booking = await this.bookingService.getBooking({ id: { eq: input.id } });

    const updatedBooking = await this.bookingService.updateBooking({ ...input, customerId });

    if (!updatedBooking) throw new BookingNotFoundError('Booking not found');

    // Log changes if the booking date has changed
    if (booking.dateTime.toISOString() !== updatedBooking.dateTime.toISOString()) {
      const metadata = new Map();
      metadata.set('previousDateTime', booking.dateTime.toISOString());
      metadata.set('dateTime', updatedBooking.dateTime.toISOString());
      await this.bookingHistoryService.createBookingHistory({
        bookingId: updatedBooking._id,
        status: BookingHistoryStatusType.PENDING,
        metadata,
      });
    }

    // TODO: Send notifications
    return updatedBooking;
  }

  // Mutation: Accept a booking (Service Provider only)
  @HasRole(UserType.SERVICE_PROVIDER)
  async acceptBooking(@CurrentUser() currentUser: RequestUser, @Args('input') input: AcceptBookingInput) {
    const serviceProviderId = (currentUser as ServiceProvider)._id;

    const booking = await this.bookingService.acceptBooking({
      id: input.id,
      serviceProviderId: serviceProviderId,
    });

    if (!booking) throw new BookingNotFoundError('Booking not found');

    // Log booking acceptance
    await this.bookingHistoryService.createBookingHistory({
      bookingId: booking._id,
      status: BookingHistoryStatusType.ACCEPTED,
    });

    // TODO: Send notifications
    return booking;
  }

  @HasRole(UserType.SERVICE_PROVIDER, UserType.CUSTOMER)
  async cancelBooking(@CurrentUser() currentUser: RequestUser, @Args('input') input: CancelBookingInput) {
    let userId: string;

    // Determine the user ID based on the user's type (SERVICE_PROVIDER or CUSTOMER)
    switch (currentUser.userType) {
      case UserType.SERVICE_PROVIDER:
        userId = (currentUser as ServiceProvider)._id.toString();
        break;
      case UserType.CUSTOMER:
        userId = (currentUser as Customer)._id.toString();
        break;
    }

    // Call the service to cancel the booking with the provided booking ID and user ID
    const booking = await this.bookingService.cancelBooking({ id: input.id, userId });

    // If no booking is found, throw a specific error
    if (!booking) throw new BookingNotFoundError('Booking not found');

    // TODO: Send notification logic (e.g., push notification, email, etc.)

    // Record the cancellation in the booking history
    await this.bookingHistoryService.createBookingHistory({
      bookingId: booking._id,
      status: BookingHistoryStatusType.CANCELED,
    });

    return booking;
  }

  @ResolveField(() => String)
  date(@Root() booking: Booking) {
    // Convert the ISO date-time string to a formatted date string (e.g., 'yyyy-MM-dd')
    return DateTime.fromISO(booking.dateTime.toISOString()).toFormat('yyyy-MM-dd');
  }

  @ResolveField(() => String)
  time(@Root() booking: Booking) {
    // Convert the ISO date-time string to a formatted time string (e.g., 'HH:mm')
    return DateTime.fromISO(booking.dateTime.toISOString()).toFormat('HH:mm');
  }

  @ResolveField(() => Customer, { nullable: true })
  async customer(@Root() booking: Booking) {
    // Fetch the customer details by customer ID associated with the booking
    return this.customerService.getCustomerById(booking.customerId);
  }

  @ResolveField(() => ServiceProvider, { nullable: true })
  async serviceProvider(@Root() booking: Booking) {
    // Define a filter input to find the service provider by ID
    const filterInput: ServiceProviderFilterInput = { id: { eq: booking.serviceProviderId.toString() } };

    // Fetch the service provider details
    return this.serviceProviderService.getServiceProvider(filterInput);
  }

  @ResolveField(() => Category)
  async category(@Root() booking: Booking) {
    const input = { id: { eq: booking.categoryId.toString() } };
    // Fetch the category details by category ID associated with the booking
    return this.categoryService.getCategory(input);
  }

  @ResolveField(() => BookingHistoryConnection)
  async histories(@Root() booking: Booking, @Args() connectionArgs: ConnectionArgs) {
    // Define a filter to fetch booking histories for the specific booking ID
    const filter = { bookingId: { eq: booking.id.toString() } };

    // Fetch paginated booking histories
    return this.bookingHistoryService.getPaginatedBookingHistories(connectionArgs, { filter });
  }

  @ResolveField(() => CustomerAddress)
  async customerAddress(@Root() booking: Booking) {
    // Define a filter input to find the customer address by ID
    const filter = { id: { eq: booking.customerAddressId.toString() } };

    // Fetch the customer address details
    return this.customerAddressService.getCustomerAddress(filter);
  }
}
