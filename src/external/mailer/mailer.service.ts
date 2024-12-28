import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService as BaseMailerService } from '@nestjs-modules/mailer';

import { EnvironmentVariables } from '../../config/config.type';
import { MailTransport } from '../../modules/common/types/mailer.type';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: BaseMailerService,
    private readonly configService: ConfigService,
  ) {}

  sendEmail(sendMailOptions: ISendMailOptions) {
    if ('true' === process.env.DISABLE_MAIL_SERVICE) return Promise.resolve();

    return this.mailerService.sendMail(sendMailOptions);
  }

  async sendAdminResetPasswordOtp(email: string, name: string, token: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Welcome to our service! Confirm your Email',
      template: './confirmation',
      context: { name, token },
    });
  }

  async sendAdminResetPasswordLink(email: string, name: string, link: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Reset Password',
      template: './admin-reset-password',
      context: { name, link },
    });
  }

  async sendCustomerVerifyRegistration(email: string, token: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Verify your Fixerloop account',
      template: './auth/customer/register/register-verification',
      context: {
        token,
      },
    });
  }

  async sendCustomerSocialMediaRegistration(email: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Welcome to Fixerloop',
      template: './auth/customer/register/register-social-media-confirmation',
    });
  }

  async sendCustomerRegistrationConfirmation(email: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Fixerloop Account Verification',
      template: './auth/customer/register/register-verification-confirmation',
    });
  }

  async sendCustomerResetPassword(name: string, email: string, otp: string, expiresInMinutes: number) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Reset your password',
      template: './auth/customer/reset-password/reset-password',
      context: {
        name,
        otp,
        expiresInMinutes,
      },
    });
  }

  async sendCustomerResetPasswordConfirmation(name: string, email: string) {
    const config = this.configService.get<EnvironmentVariables['mailer'][MailTransport.NO_REPLY]>(
      `mailer.${MailTransport.NO_REPLY}`,
    );

    return this.sendEmail({
      transporterName: MailTransport.NO_REPLY,
      to: email,
      from: config.from,
      replyTo: config.user,
      subject: 'Reset password',
      template: './auth/customer/reset-password/reset-password-confirmation',
      context: { name },
    });
  }
}
