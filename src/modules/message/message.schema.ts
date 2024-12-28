import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '../common/schemas/base.schema';
import { UserType } from '../common/types/user.type';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  LOCATION = 'LOCATION',
  BOOKING_HISTORY = 'BOOKING_HISTORY',
}

@ObjectType()
class TextMessage {
  @Field()
  content: string;
}

@ObjectType()
export class BookingHistoryMessage {
  @Prop({ required: true })
  bookingHistoryId: Types.ObjectId;
}

export const MessageContent = createUnionType({
  name: 'MessageContent',
  types: () => [TextMessage, BookingHistoryMessage] as const,
  resolveType(message: Message) {
    console.log('message.type: ', message.type);
    switch (message.type) {
      case MessageType.TEXT:
        return TextMessage;
      //todo:: case MessageType.IMAGE:
      //todo:: case MessageType.AUDIO:
      //todo:: case MessageType.VIDEO:
      //todo:: case MessageType.LOCATION:
      case MessageType.BOOKING_HISTORY:
        return BookingHistoryMessage;
    }
    return BookingHistoryMessage;
  },
});

@ObjectType()
@Schema({ collection: 'messages', timestamps: true })
export class Message extends BaseSchema {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  conversationId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  senderId: Types.ObjectId;

  @Prop({ enum: [UserType.CUSTOMER, UserType.SERVICE_PROVIDER], required: true })
  senderType: string;

  @Field(() => MessageType)
  @Prop({ required: true, enum: MessageType })
  type: MessageType;

  @Field(() => MessageContent)
  @Prop({ type: mongoose.Schema.Types.Mixed })
  content: Types.Map<any>;

  @Prop({ default: [], type: [mongoose.Schema.Types.ObjectId] })
  readBy: Array<Types.ObjectId>;
}

export type MessageDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);
