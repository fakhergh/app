import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Session, SessionSchema } from '@/modules/session/session.schema';
import { SessionService } from '@/modules/session/session.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
