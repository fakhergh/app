import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EnvironmentVariables } from '@/config/config.type';
import { IpInfoDataSourceModule } from '@/graphql/data-source/ip-info/ip-info.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { AuthResolver } from '@/modules/auth/auth.resolver';
import { AuthService } from '@/modules/auth/auth.service';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { CustomerModule } from '@/modules/customer/customer.module';
import { ServiceProviderModule } from '@/modules/service-provider/service-provider.module';
import { SessionModule } from '@/modules/session/session.module';
import { VerificationTokenModule } from '@/modules/verification-token/verification-token.module';

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
