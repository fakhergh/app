import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserType } from '../common/types/user.type';
import { VerificationToken } from '../verification-token/verification-token.schema';

export class CreateVerificationTokenData {
  token: string;
  userId: Types.ObjectId;
  userType: UserType;
  expiresIn: Date;
}

@Injectable()
export class VerificationTokenService {
  constructor(@InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationToken>) {}

  getVerificationTokenByToken(token: string) {
    const filter = { token };
    return this.verificationTokenModel.findOne(filter);
  }

  createVerificationToken(data: CreateVerificationTokenData) {
    return this.verificationTokenModel.create(data);
  }

  validateVerificationToken(id: Types.ObjectId | string) {
    const filter = { _id: id, verified: { $ne: true } };
    const update = { $set: { verified: true } };
    const options = { new: true };
    return this.verificationTokenModel.findOneAndUpdate(filter, update, options);
  }

  deleteVerificationToken(id: Types.ObjectId | string) {
    return this.verificationTokenModel.findByIdAndDelete(id);
  }
}
