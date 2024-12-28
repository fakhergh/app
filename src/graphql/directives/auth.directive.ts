import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql/execution';
import { DirectiveLocation } from 'graphql/language';
import { GraphQLDirective, GraphQLEnumType, GraphQLList, GraphQLSchema } from 'graphql/type';

import { UserType } from '../../modules/common/types/user.type';

export const authDirective = new GraphQLDirective({
  name: 'auth',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    roles: {
      type: new GraphQLList(
        new GraphQLEnumType(
          Object.keys(UserType).reduce(
            (prev, key: string) => {
              prev.values[key] = { value: UserType[key] };
              return prev;
            },
            { name: 'UserType', values: {} },
          ),
        ),
      ),
    },
  },
});

export function authDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          console.log('Role: ', directive.role);

          console.log('source: ', source);
          console.log('args: ', args);
          //console.log('context: ', context);
          const result = await resolve(source, args, context, info);

          if (typeof result === 'string') {
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
}
