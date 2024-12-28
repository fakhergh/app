import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { EnvironmentVariables } from '../../config/config.type';
import { MailTransport } from '../../modules/common/types/mailer.type';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    ConfigModule,
    NodeMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const noReply = config.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
          `mailer.${MailTransport.NO_REPLY}`,
        );

        const contact = config.get<EnvironmentVariables['mailer'][MailTransport.CONTACT]>(
          `mailer.${MailTransport.CONTACT}`,
        );

        const support = config.get<EnvironmentVariables['mailer'][MailTransport.SUPPORT]>(
          `mailer.${MailTransport.SUPPORT}`,
        );

        return {
          transports: {
            [MailTransport.NO_REPLY]: {
              host: noReply.host,
              port: noReply.port,
              secure: noReply.secure,
              auth: {
                user: noReply.user,
                pass: noReply.pass,
              },
            },
            [MailTransport.CONTACT]: {
              host: contact.host,
              port: contact.port,
              secure: contact.secure,
              auth: {
                user: contact.user,
                pass: contact.pass,
              },
            },
            [MailTransport.SUPPORT]: {
              host: support.host,
              port: support.port,
              secure: support.secure,
              auth: {
                user: support.user,
                pass: support.pass,
              },
            },
          },
          template: {
            dir: join(__dirname, '../mailer/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
