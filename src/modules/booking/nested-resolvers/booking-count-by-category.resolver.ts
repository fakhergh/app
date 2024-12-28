import { Args, ResolveField, Resolver, Root } from '@nestjs/graphql';

import { Language } from '../../common/types/language';
import { BookingCountByCategory } from '../booking.type';

@Resolver(() => BookingCountByCategory)
export class BookingCountByCategoryResolver {
  @ResolveField(() => String)
  name(
    @Root() parent: { name: Record<Language, string> },
    @Args('lang', { type: () => Language, nullable: true }) lang: Language,
  ) {
    return parent.name[lang] ?? parent.name[Language.EN];
  }
}
