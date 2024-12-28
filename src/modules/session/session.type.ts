import { Types } from 'mongoose';

import { UserType } from '../common/types/user.type';

export class CreateSessionDto {
  accessToken: string;
  refreshToken: string;
  userId: Types.ObjectId | string;
  userType: UserType;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  ip: string;
  region?: string;
  country: string;
  countryCode: string;
  city?: string;
  coordinates: [string | number, string | number];
  agent: string;
  platform: string;
}
