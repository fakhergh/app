import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VerificationToken, VerificationTokenSchema } from '@/modules/verification-token/verification-token.schema';
import { VerificationTokenService } from '@/modules/verification-token/verification-token.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: VerificationToken.name, schema: VerificationTokenSchema }])],
  providers: [VerificationTokenService],
  exports: [VerificationTokenService],
})
export class VerificationTokenModule {}
