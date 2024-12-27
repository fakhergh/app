import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { ApolloDriver, ApolloDriverConfig, Plugin } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
//import GraphQLJSON from 'graphql-type-json';
import { join } from 'path';

import { authDirective, authDirectiveTransformer } from '@/graphql/directives/auth.directive';
import { CategoryModule } from '@/modules/category/category.module';
import { FileModule } from '@/modules/file/file.module';
import { MediaModule } from '@/modules/media/media.module';
import { PermissionModule } from '@/modules/permission/permission.module';

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
    PermissionModule,
    CategoryModule,
    FileModule,
    MediaModule,
  ],
  providers: [LoggingPlugin],
})
export class GraphqlModule {}
