import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from '@/config/config.type';

export default registerAs<EnvironmentVariables['googleSignIn']>('googleSignIn', () => ({
  androidClientId: process.env.GOOGLE_SIGN_IN_ANDROID_CLIENT_ID,
  iosClientId: process.env.GOOGLE_SIGN_IN_IOS_CLIENT_ID,
}));
