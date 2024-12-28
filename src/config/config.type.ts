import { Environment } from '../modules/common/types/env.type';
import { MailTransport } from '../modules/common/types/mailer.type';

export type EnvironmentVariables = {
  server: {
    env: Environment;
    port: number;
  };
  jwt: {
    accessTokenSecretKey: string;
    refreshTokenSecretKey: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  database: {
    uri: string;
  };
  oneSignal: {
    appId: string;
    apiKey: string;
  };
  mailer: {
    [k in MailTransport]: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
      from: string;
    };
  };
  googleSignIn: {
    androidClientId: string;
    iosClientId: string;
  };
  auth: {
    twoFactorEncryptionKey: string;
  };
};
