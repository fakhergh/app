import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import appleSignInAuth from 'apple-signin-auth';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';
import * as base32 from 'thirty-two';
import { ulid } from 'ulid';

import { HasRole } from '../../common/decorators/has-role.decorator';
import { HasPermission } from '../../common/decorators/permission.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/directives/current-user.directive';
import { generate2faSecretQrCodeUrl, verifyTwoFactorOtp } from '../../common/utils/2fa';
import { compareHash, hash } from '../../common/utils/bcrypt.util';
import { decrypt, encrypt } from '../../common/utils/crypto';
import { generateOtp } from '../../common/utils/otp';
import { EnvironmentVariables } from '../../config/config.type';
import { MailerService } from '../../external/mailer/mailer.service';
import { IpInfoDatasource } from '../../graphql/data-source/ip-info/ip-info.datasource';
import { AdminNotFoundError, ResetPasswordInvalidInputError } from '../admin/admin.error';
import { Admin } from '../admin/admin.schema';
import { AdminService } from '../admin/admin.service';
import { AuthProvider, RequestUser } from '../common/types/auth.type';
import { PERMISSIONS } from '../common/types/permission.type';
import { UserType } from '../common/types/user.type';
import { CustomerDuplicationError, CustomerNotFoundError, CustomerVerificationError } from '../customer/customer.error';
import { CustomerService } from '../customer/customer.service';
import { ServiceProviderDuplicationError } from '../service-provider/service-provider.error';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { SessionService } from '../session/session.service';
import {
  CreateVerificationTokenData,
  VerificationTokenService,
} from '../verification-token/verification-token.service';
import {
  InvalidCredentialsError,
  InvalidOTPError,
  TwoFactorAuthenticationDisabledError,
  TwoFactorAuthenticationEnabledError,
  UnauthenticatedError,
} from './auth.error';
import { AuthService } from './auth.service';
import {
  AdminBasicSignIn,
  AdminChangePasswordInput,
  AdminDisableTwoFactorInput,
  AdminEnableTwoFactorInput,
  AdminForgotPassword,
  AdminForgotPasswordInput,
  AdminGenerateTwoFactorSecret,
  AdminRefreshToken,
  AdminRefreshTokenInput,
  AdminResetPasswordInput,
  AdminSignIn,
  AdminSignInInput,
  AdminTwoFactorSignIn,
  AdminVerifySignIn,
  AdminVerifySignInInput,
  CustomerAppleSignInInput,
  CustomerForgotPassword,
  CustomerForgotPasswordInput,
  CustomerGoogleSignInInput,
  CustomerResetPasswordInput,
  CustomerSignIn,
  CustomerSignInInput,
  CustomerSignUp,
  CustomerSignUpInput,
  CustomerVerifyForgotPassword,
  CustomerVerifyForgotPasswordInput,
  CustomerVerifySignUpInput,
  JwtPayload,
  ServiceProviderSignIn,
  ServiceProviderSignInInput,
  ServiceProviderSignUp,
  ServiceProviderSignUpInput,
  SignInType,
} from './auth.type';

class CreateSessionData {
  payload: JwtPayload;
  ip: string;
  userId: Types.ObjectId | string;
  userType: UserType;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly mailerService: MailerService,
    private readonly sessionService: SessionService,
    private readonly ipInfoDatasource: IpInfoDatasource,
    private readonly customerService: CustomerService,
    private readonly serviceProviderService: ServiceProviderService,
    private readonly configService: ConfigService,
    private readonly verificationTokenService: VerificationTokenService,
  ) {}

  private async createSession(data: CreateSessionData): Promise<{ accessToken: string; refreshToken: string }> {
    const { payload, ip, userId, userType } = data;

    const accessToken = await this.authService.signAccessToken(payload);
    const refreshToken = await this.authService.signRefreshToken(payload);

    const accessTokenPayload = await this.authService.verifyToken(accessToken);
    const refreshTokenPayload = await this.authService.verifyToken(refreshToken);

    const response = await this.ipInfoDatasource.getIpInfo(ip);

    await this.sessionService.createSession({
      userId,
      userType,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: DateTime.fromMillis(accessTokenPayload.exp * 1000).toJSDate(),
      refreshTokenExpiresAt: DateTime.fromMillis(refreshTokenPayload.exp * 1000).toJSDate(),
      ip: response.ip,
      region: response.region,
      country: response.country,
      countryCode: response.country_code,
      city: response.city,
      coordinates: [response.latitude, response.longitude],
      agent: 'test',
      platform: 'test',
    });

    return { accessToken, refreshToken };
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.READ)
  @Query(() => Admin)
  async adminMe(@CurrentUser() currentUser: RequestUser) {
    return currentUser;
  }

  @Public()
  @Mutation(() => CustomerSignIn)
  async customerSignIn(@Context() { req }: { req: Request }, @Args('input') input: CustomerSignInInput) {
    const userType = UserType.CUSTOMER;
    const authProvider = AuthProvider.DEFAULT;

    const customer = await this.customerService.getCustomerByEmail(input.email);

    if (
      !customer ||
      (customer.authProvider === AuthProvider.DEFAULT && !customer.verified) ||
      customer.deleted ||
      !customer.password
    )
      throw new InvalidCredentialsError('Invalid credentials');

    const passwordMatches = await compareHash(input.password, customer.password);

    if (!passwordMatches) throw new InvalidCredentialsError('Invalid credentials');

    const payload: JwtPayload = {
      id: customer._id.toString(),
      userType,
      authProvider,
    };

    const sessionData = { payload, ip: req.ip, userId: customer._id, userType };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, customer };
  }

  @Public()
  @Mutation(() => CustomerSignIn)
  async customerGoogleSignIn(@Context() { req }: { req: Request }, @Args('input') input: CustomerGoogleSignInInput) {
    const { androidClientId, iosClientId } =
      this.configService.get<EnvironmentVariables['googleSignIn']>('googleSignIn');

    const client = new OAuth2Client();
    const userType = UserType.CUSTOMER;
    const authProvider = AuthProvider.GOOGLE;
    let name: string;
    let email: string;

    try {
      const ticket = await client.verifyIdToken({
        idToken: input.idToken,
        audience: [androidClientId, iosClientId],
      });
      const tokenPayload = ticket.getPayload();
      name = tokenPayload.name;
      email = tokenPayload.email;
    } catch (error) {
      throw new UnauthenticatedError('Invalid user');
    }

    let customer = await this.customerService.getCustomerByEmail(email);

    if (!customer || customer.deleted) {
      customer = await this.customerService.createCustomer({
        initialName: name,
        name: name,
        email,
        authProvider,
      });
      this.mailerService.sendCustomerSocialMediaRegistration(customer.email).catch(console.log);
    } else if (!customer.active) {
      throw new UnauthenticatedError('Customer is disabled');
    }

    const payload: JwtPayload = {
      id: customer._id.toString(),
      userType,
      authProvider,
    };

    const sessionData = { payload, ip: req.ip, userId: customer._id, userType };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, customer };
  }

  @Public()
  @Mutation(() => CustomerSignIn)
  async customerAppleSignIn(@Context() { req }: { req: Request }, @Args('input') input: CustomerAppleSignInInput) {
    const authProvider = AuthProvider.APPLE;
    const userType = UserType.CUSTOMER;
    let email: string;

    try {
      const appleIdTokenClaims = await appleSignInAuth.verifyIdToken(input.idToken, {
        /** sha256 hex hash of raw nonce */
        nonce: input.nonce ? crypto.createHash('sha256').update(input.nonce).digest('hex') : undefined,
      });

      email = appleIdTokenClaims.email;
    } catch (error) {
      throw new UnauthenticatedError('Invalid user');
    }

    let customer = await this.customerService.getCustomerByEmail(email);

    if (!customer) {
      customer = await this.customerService.createCustomer({
        initialName: input.name,
        name: input.name,
        email,
        authProvider,
      });

      this.mailerService.sendCustomerSocialMediaRegistration(customer.email).catch(console.log);
    } else if (customer.deleted) {
      customer = await this.customerService.createCustomer({
        initialName: input.name ?? customer.initialName,
        name: input.name ?? customer.initialName,
        email,
        authProvider,
      });
      this.mailerService.sendCustomerSocialMediaRegistration(customer.email).catch(console.log);
    } else if (!customer.active) {
      throw new UnauthenticatedError('Customer is disabled');
    }

    const payload: JwtPayload = {
      id: customer._id.toString(),
      userType,
      authProvider,
    };

    const sessionData = { payload, ip: req.ip, userId: customer._id, userType };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, customer };
  }

  @Public()
  @Mutation(() => CustomerSignUp)
  async customerSignUp(@Args('input') input: CustomerSignUpInput) {
    let customer = await this.customerService.getCustomerByEmail(input.email);

    if (customer || !customer.deleted) throw new CustomerDuplicationError('User already exists');

    const otp = generateOtp();

    customer = await this.customerService.createCustomer({
      initialName: input.name,
      name: input.name,
      email: input.email,
      password: input.password,
      authProvider: AuthProvider.DEFAULT,
      verifyAccountToken: otp,
    });

    this.mailerService.sendCustomerVerifyRegistration(customer.email, otp).catch(console.log);

    return { email: customer.email };
  }

  @Public()
  @Mutation(() => Boolean)
  async customerVerifySignUp(@Args('input') input: CustomerVerifySignUpInput) {
    let customer = await this.customerService.getCustomerByEmail(input.email);

    if (!customer) throw new CustomerNotFoundError('Invalid email');

    if (customer.verified) throw new CustomerVerificationError('Customer is verified');

    if (input.code === customer.verifyAccountToken) throw new CustomerVerificationError('Invalid verification code');

    customer = await this.customerService.verifyCustomer(input.email);

    this.mailerService.sendCustomerRegistrationConfirmation(customer.email).catch(console.log);

    return true;
  }

  @Public()
  @Mutation(() => CustomerForgotPassword)
  async customerForgotPassword(@Args('input') input: CustomerForgotPasswordInput) {
    const customer = await this.customerService.getCustomerByEmail(input.email);

    if (!customer || customer.deleted || !customer.active) throw new CustomerNotFoundError('Invalid email');

    const otp = generateOtp();

    const expiresInMinutes = 15;
    const forgotPasswordExpiresAt = DateTime.now().plus({ minutes: expiresInMinutes }).toJSDate();

    await this.customerService.updateForgotPasswordToken(customer._id, otp, forgotPasswordExpiresAt);

    this.mailerService
      .sendCustomerResetPassword(customer.name, customer.email, otp, expiresInMinutes)
      .catch(console.log);

    return { email: customer.email };
  }

  @Public()
  @Mutation(() => CustomerVerifyForgotPassword)
  async customerVerifyForgotPassword(@Args('input') input: CustomerVerifyForgotPasswordInput) {
    let customer = await this.customerService.getCustomerByEmail(input.email);

    if (!customer || customer.deleted || !customer.active) throw new CustomerNotFoundError('Invalid email');

    const nowDate = DateTime.now().toMillis();
    const expiresInDate = DateTime.fromISO(customer.forgotPasswordExpiresAt?.toISOString()).toMillis();

    if (input.code !== customer.forgotPasswordToken || nowDate > expiresInDate)
      throw new InvalidOTPError('Invalid OTP or expired');

    const expiresInMinutes = 15;
    const forgotPasswordExpiresAt = DateTime.now().plus({ minutes: expiresInMinutes }).toJSDate();

    const otp = generateOtp();

    customer = await this.customerService.updateForgotPasswordToken(customer._id, null, null);
    customer = await this.customerService.updateResetPasswordToken(customer._id, otp, forgotPasswordExpiresAt);

    return { email: customer.email, code: customer.resetPasswordToken };
  }

  @Public()
  @Mutation(() => Boolean)
  async customerResetPassword(@Args('input') input: CustomerResetPasswordInput) {
    let customer = await this.customerService.getCustomerByEmail(input.email);

    if (!customer || customer.deleted || !customer.active) throw new CustomerNotFoundError('Invalid email');

    const nowDate = DateTime.now().toMillis();
    const expiresInDate = DateTime.fromISO(customer.resetPasswordExpiresAt?.toISOString()).toMillis();

    if (input.code !== customer.resetPasswordToken || nowDate > expiresInDate)
      throw new InvalidOTPError('Invalid OTP or expired');

    const hashedPassword = await hash(input.password);

    customer = await this.customerService.updatePassword(customer._id, hashedPassword);
    customer = await this.customerService.updateResetPasswordToken(customer._id, null, null);

    if (customer)
      this.mailerService.sendCustomerResetPasswordConfirmation(customer.name, customer.email).catch(console.log);

    return customer !== null;
  }

  @Public()
  @Mutation(() => ServiceProviderSignIn)
  async serviceProviderSignIn(@Context() { req }: { req: Request }, @Args('input') input: ServiceProviderSignInInput) {
    const userType = UserType.SERVICE_PROVIDER;

    const serviceProvider = await this.serviceProviderService.getServiceProviderByEmail(input.email);

    if (!serviceProvider) throw new InvalidCredentialsError('Invalid email');

    const isValidPassword = await compareHash(input.password, serviceProvider.password);

    if (isValidPassword) throw new InvalidCredentialsError('Invalid password');

    const payload: JwtPayload = {
      id: serviceProvider._id.toString(),
      userType: UserType.SERVICE_PROVIDER,
    };

    const sessionData = {
      payload,
      ip: req.ip,
      userId: serviceProvider._id,
      userType,
    };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, serviceProvider };
  }

  @Public()
  @Mutation(() => ServiceProviderSignUp)
  async serviceProviderSignUp(@Context() { req }: { req: Request }, @Args('input') input: ServiceProviderSignUpInput) {
    const userType = UserType.SERVICE_PROVIDER;
    const serviceProviderExists = await this.serviceProviderService.getServiceProviderByEmail(input.email);

    if (serviceProviderExists) throw new ServiceProviderDuplicationError('Service providers already exists');

    const serviceProvider = await this.serviceProviderService.createServiceProvider(input);

    const payload: JwtPayload = {
      id: serviceProvider._id.toString(),
      userType,
    };

    const sessionData = {
      payload,
      ip: req.ip,
      userId: serviceProvider._id,
      userType,
    };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, serviceProvider };
  }

  @Public()
  @Mutation(() => AdminSignIn)
  async adminSignIn(
    @Args('input') input: AdminSignInInput,
    @Context() { req }: { req: Request },
  ): Promise<AdminBasicSignIn | AdminTwoFactorSignIn | AdminNotFoundError> {
    const userType = UserType.ADMIN;
    const admin = await this.adminService.getAdminByEmail(input.email);

    if (!admin || !admin.active) throw new AdminNotFoundError('Invalid user');

    const isValidPassword = await bcryptjs.compare(input.password, admin.password);

    if (!isValidPassword) throw new AdminNotFoundError('Invalid password');

    if (admin.twoFactor?.enabled) {
      const token = ulid();

      const expiresInMinutes = 5;

      const verificationTokenData: CreateVerificationTokenData = {
        token,
        userId: admin._id,
        userType: UserType.ADMIN,
        expiresIn: DateTime.now().plus({ minutes: expiresInMinutes }).toJSDate(),
      };

      await this.verificationTokenService.createVerificationToken(verificationTokenData);

      return { type: SignInType.TWO_FACTOR, token } as AdminTwoFactorSignIn;
    }

    const payload: JwtPayload = { id: admin._id.toString(), userType };

    const sessionData = { payload, ip: req.ip, userId: admin._id, userType };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return {
      type: SignInType.BASIC,
      accessToken,
      refreshToken,
      admin,
    } as AdminBasicSignIn;
  }

  @Public()
  @Mutation(() => AdminVerifySignIn)
  async adminVerifySignIn(@Args('input') input: AdminVerifySignInInput, @Context() { req }: { req: Request }) {
    const userType = UserType.ADMIN;

    const verificationToken = await this.verificationTokenService.getVerificationTokenByToken(input.token);

    if (!verificationToken || verificationToken.verified || verificationToken.userType !== userType)
      throw new InvalidOTPError('Invalid verification token');

    const verificationTokenExpiresAt = DateTime.fromISO(verificationToken.expiresIn.toString());
    const now = DateTime.now();

    if (now > verificationTokenExpiresAt) {
      throw new InvalidOTPError('Invalid token');
    }

    const admin = await this.adminService.getAdminById(verificationToken.userId);

    if (!admin || !admin.active) throw new AdminNotFoundError('Invalid user');

    const encryptionKey = this.configService.get<EnvironmentVariables['auth']>('auth').twoFactorEncryptionKey;

    const decryptedSecret = decrypt(admin.twoFactor?.secret, encryptionKey, admin.twoFactor.iv);

    const verified = verifyTwoFactorOtp(input.code, decryptedSecret);

    if (!verified) throw new InvalidOTPError('Invalid otp');

    await this.verificationTokenService.validateVerificationToken(verificationToken._id);

    const payload: JwtPayload = { id: admin._id.toString(), userType };

    const sessionData = { payload, ip: req.ip, userId: admin._id, userType };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    return { accessToken, refreshToken, admin } as AdminVerifySignIn;
  }

  @Public()
  @Mutation(() => AdminForgotPassword)
  async adminForgotPassword(@Args('input') input: AdminForgotPasswordInput) {
    const admin = await this.adminService.getAdminByEmail(input.email);

    if (!admin) throw new AdminNotFoundError('Admin not found');

    const resetPasswordToken: string = ulid().toLowerCase();
    const resetPasswordExpiresAt: Date = DateTime.now().plus({ days: 2 }).toJSDate();

    await this.adminService.updateAdminResetToken(admin._id, resetPasswordToken, resetPasswordExpiresAt);

    const resetPasswordLink = this.adminService.generateAdminResetPasswordLink(admin.email, resetPasswordToken);

    this.mailerService.sendAdminResetPasswordLink(admin.email, admin.name, resetPasswordLink).catch((reason) => {
      console.log(reason);
      //todo:: log email error
    });

    return { token: resetPasswordToken };
  }

  @Public()
  @Mutation(() => Boolean)
  async adminResetPassword(@Args('input') input: AdminResetPasswordInput) {
    const admin = await this.adminService.getAdminByEmail(input.email);

    if (!admin || !admin?.active) {
      throw new AdminNotFoundError('Admin not found');
    }

    if (admin.resetPasswordToken !== input.token) {
      throw new ResetPasswordInvalidInputError('Invalid token');
    }

    const resetPasswordExpiresAt = DateTime.fromISO(admin.resetPasswordExpiresAt.toString());
    const now = DateTime.now();

    if (now > resetPasswordExpiresAt) {
      throw new ResetPasswordInvalidInputError('Invalid token');
    }

    const passwordHash = await hash(input.password);

    await this.adminService.changePassword(admin._id, passwordHash);

    return true;
  }

  @HasRole(UserType.ADMIN)
  @Mutation(() => AdminGenerateTwoFactorSecret)
  async adminGenerateTwoFactorSecret(@CurrentUser() admin: Admin) {
    if (admin.twoFactor?.enabled) throw new TwoFactorAuthenticationEnabledError('2FA already enabled');

    const buffer = crypto.randomBytes(10);
    const secret = base32.encode(buffer).toString('utf8').replace(/=/g, '');
    const formattedSecret = secret.match(/.{1,4}/g).join('-');

    const qrCodeUrl = generate2faSecretQrCodeUrl(formattedSecret, 'Fixerloop Admin', admin.email);

    const secretKey = this.configService.get<EnvironmentVariables['auth']>('auth').twoFactorEncryptionKey;

    const encryptedSecret = encrypt(secret, secretKey);

    await this.adminService.setTwoFactorSecret(admin._id, encryptedSecret.encryptedData, encryptedSecret.iv);

    return { secret: formattedSecret, qrCodeUrl };
  }

  @HasRole(UserType.ADMIN)
  @Mutation(() => Boolean)
  async adminEnableTwoFactor(@CurrentUser() admin: Admin, @Args('input') input: AdminEnableTwoFactorInput) {
    const encryptionKey = this.configService.get<EnvironmentVariables['auth']>('auth').twoFactorEncryptionKey;

    const decryptedSecret = decrypt(admin.twoFactor.secret, encryptionKey, admin.twoFactor.iv);

    const verified = verifyTwoFactorOtp(input.code, decryptedSecret);

    if (verified) await this.adminService.enableTwoFactor(admin._id);

    return verified;
  }

  @HasRole(UserType.ADMIN)
  @Mutation(() => Admin)
  async adminDisableTwoFactor(@CurrentUser() admin: Admin, @Args('input') input: AdminDisableTwoFactorInput) {
    const isValidPassword = await compareHash(input.password, admin.password);

    if (!isValidPassword) throw new InvalidCredentialsError('Invalid password');

    if (!admin.twoFactor?.enabled) throw new TwoFactorAuthenticationDisabledError('2FA already disabled');

    return this.adminService.disableTwoFactor(admin._id);
  }

  @HasRole(UserType.ADMIN)
  @Mutation(() => Boolean)
  async adminChangePassword(@CurrentUser() admin: Admin, @Args('input') input: AdminChangePasswordInput) {
    const isValidPassword = await compareHash(input.oldPassword, admin.password);

    if (!isValidPassword) throw new InvalidCredentialsError('Invalid password');

    const passwordHash = await hash(input.password);

    await this.adminService.changePassword(admin._id, passwordHash);

    return true;
  }

  @Public()
  @Mutation(() => AdminRefreshToken)
  async adminRefreshToken(@Context() { req }: { req: Request }, @Args('input') input: AdminRefreshTokenInput) {
    const session = await this.sessionService.getSessionExistenceByRefreshToken(input.refreshToken);

    if (!session || session.accessToken !== input.accessToken) throw new UnauthenticatedError('Cannot refresh token');

    const refreshTokenPayload = await this.authService.verifyToken(input.refreshToken);

    const payload: JwtPayload = {
      id: refreshTokenPayload.id,
      userType: refreshTokenPayload.userType,
      authProvider: refreshTokenPayload.authProvider,
    };

    const sessionData = {
      payload,
      ip: req.ip,
      userId: refreshTokenPayload.id,
      userType: refreshTokenPayload.userType,
    };

    const { accessToken, refreshToken } = await this.createSession(sessionData);

    await this.sessionService.disableSession(session._id);

    return { accessToken, refreshToken };
  }
}
