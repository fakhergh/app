import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvironmentVariables } from '../../../config/config.type';
import { AdminService } from '../../admin/admin.service';
import { UserType } from '../../common/types/user.type';
import { CustomerService } from '../../customer/customer.service';
import { SessionService } from '../../session/session.service';
import { UnauthenticatedError } from '../auth.error';
import { JwtPayload } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly customerService: CustomerService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get<EnvironmentVariables['jwt']>('jwt').accessTokenSecretKey,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    const session = await this.sessionService.getSession(
      new Types.ObjectId(payload.id), //userId
      accessToken,
    );

    if (!session || !session.active) throw new UnauthenticatedError('Invalid token');

    switch (payload.userType) {
      case UserType.ADMIN:
        const admin = await this.adminService
          .getAdminById(payload.id)
          .populate({
            path: 'roles',
            match: { active: true, deleted: { $ne: true } },
            populate: { path: 'permissions', match: { active: true, deleted: { $ne: true } } },
          })
          .lean();
        return admin && admin.active ? { ...admin, userType: UserType.ADMIN } : null;

      case UserType.CUSTOMER:
        const customer = await this.customerService.getCustomerById(payload.id).lean();
        return customer?.active && customer?.verified ? { ...customer, userType: UserType.CUSTOMER } : null;
    }
  }
}
