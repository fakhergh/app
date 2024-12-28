import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EnvironmentVariables } from '../../config/config.type';
import { IpInfoDataSourceModule } from '../../graphql/data-source/ip-info/ip-info.module';
import { AdminModule } from '../admin/admin.module';
import { CustomerModule } from '../customer/customer.module';
import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { SessionModule } from '../session/session.module';
import { VerificationTokenModule } from '../verification-token/verification-token.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<EnvironmentVariables['jwt']>('jwt');
        return {
          global: true,
          secret: config.accessTokenSecretKey,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        };
      },
      inject: [ConfigService],
    }),
    AdminModule,
    SessionModule,
    CustomerModule,
    ServiceProviderModule,
    IpInfoDataSourceModule,
    VerificationTokenModule,
    ConfigModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
