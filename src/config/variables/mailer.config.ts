import { registerAs } from '@nestjs/config';

import { MailTransport } from '../../modules/common/types/mailer.type';
import { EnvironmentVariables } from '../config.type';

export default registerAs<EnvironmentVariables['mailer']>('mailer', () => ({
  [MailTransport.NO_REPLY]: {
    host: process.env.NO_REPLY_MAILER_HOST,
    port: process.env.NO_REPLY_MAILER_PORT,
    secure: process.env.NO_REPLY_MAILER_SECURE === 'true',
    user: process.env.NO_REPLY_MAILER_USER,
    pass: process.env.NO_REPLY_MAILER_PASS,
    from: process.env.NO_REPLY_MAILER_FROM,
  },
  [MailTransport.CONTACT]: {
    host: process.env.CONTACT_MAILER_HOST,
    port: process.env.CONTACT_MAILER_PORT,
    secure: process.env.CONTACT_MAILER_SECURE === 'true',
    user: process.env.CONTACT_MAILER_USER,
    pass: process.env.CONTACT_MAILER_PASS,
    from: process.env.CONTACT_MAILER_FROM,
  },
  [MailTransport.SUPPORT]: {
    host: process.env.SUPPORT_MAILER_HOST,
    port: process.env.SUPPORT_MAILER_PORT,
    secure: process.env.SUPPORT_MAILER_SECURE === 'true',
    user: process.env.SUPPORT_MAILER_USER,
    pass: process.env.SUPPORT_MAILER_PASS,
    from: process.env.SUPPORT_MAILER_FROM,
  },
}));
