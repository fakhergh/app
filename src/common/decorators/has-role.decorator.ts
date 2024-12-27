import { SetMetadata } from '@nestjs/common';

import { UserType } from '@/modules/common/types/user.type';

export const HAS_ROLE_KEY = 'hasRole';

export const HasRole = (...roles: UserType[]) => SetMetadata(HAS_ROLE_KEY, roles);
