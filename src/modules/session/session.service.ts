import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Session } from '@/modules/session/session.schema';
import { CreateSessionDto } from '@/modules/session/session.type';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

  createSession(data: CreateSessionDto) {
    return this.sessionModel.create(data);
  }

  getSession(userId?: Types.ObjectId, accessToken?: string) {
    return this.sessionModel.findOne({
      userId,
      accessToken,
      deleted: { $ne: true },
    });
  }

  getSessionExistenceByRefreshToken(refreshToken: string) {
    return this.sessionModel.findOne({ refreshToken });
  }

  disableSession(id: Types.ObjectId | string) {
    const filter = { _id: id, active: true };
    const update = { $set: { active: false } };

    return this.sessionModel.findOneAndUpdate(filter, update);
  }
}
