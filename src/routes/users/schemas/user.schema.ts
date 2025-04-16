import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { roleEnum } from 'src/config/enums';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({enum: Object.values(roleEnum), required: true })
  role: roleEnum;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  mail: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
