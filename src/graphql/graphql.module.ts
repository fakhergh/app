import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { ApolloDriver, ApolloDriverConfig, Plugin } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
//import GraphQLJSON from 'graphql-type-json';
import { join } from 'path';

import { AdminModule } from '../modules/admin/admin.module';
import { AuthModule } from '../modules/auth/auth.module';
import { BookingHistoryModule } from '../modules/booking-history/booking-history.module';
import { CategoryModule } from '../modules/category/category.module';
import { CustomerModule } from '../modules/customer/customer.module';
import { CustomerAddressModule } from '../modules/customer-address/customer-address.module';
import { FeedbackModule } from '../modules/feedback/feedback.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { PermissionModule } from '../modules/permission/permission.module';
import { RoleModule } from '../modules/role/role.module';
import { ServiceProviderModule } from '../modules/service-provider/service-provider.module';
import { SessionModule } from '../modules/session/session.module';
import { VerificationTokenModule } from '../modules/verification-token/verification-token.module';
import { authDirective, authDirectiveTransformer } from './directives/auth.directive';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(requestContext: any): Promise<GraphQLRequestListener<any>> {
    Logger.log(requestContext.request.variables, 'GraphQL Query Variables');
    Logger.log(requestContext.request.query, 'GraphQL Query');

    return {};
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      sortSchema: true,
      includeStacktraceInErrorResponses: false,
      resolvers: {
        //JSON: GraphQLJSON,
      },
      transformSchema: (schema) => {
        return authDirectiveTransformer(schema, 'auth');
      },
      buildSchemaOptions: {
        directives: [authDirective],
      },
    }),
    AdminModule,
    AuthModule,
    BookingHistoryModule,
    CategoryModule,
    CustomerAddressModule,
    CustomerModule,
    FeedbackModule,
    NotificationModule,
    PermissionModule,
    RoleModule,
    ServiceProviderModule,
    SessionModule,
    VerificationTokenModule,
  ],
  providers: [LoggingPlugin],
})
export class GraphqlModule {}
