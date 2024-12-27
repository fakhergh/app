import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvironmentVariables } from '@/config/config.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: Buffer | object) {
    return this.jwtService.signAsync(payload);
  }

  signRefreshToken(payload: Buffer | object) {
    const config = this.configService.get<EnvironmentVariables['jwt']>('jwt');
    const expiresIn = config.refreshTokenExpiresIn;

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
