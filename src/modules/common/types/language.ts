import { registerEnumType } from '@nestjs/graphql';

export enum Language {
  EN = 'en',
  AR = 'ar',
}

registerEnumType(Language, { name: 'Language' });
