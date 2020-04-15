import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass, arrayProp, Ref, plugin } from '@typegoose/typegoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Device } from './device';
import { Errors } from '../errors';

@ObjectType({ description: 'User model' })
@plugin(uniqueValidator, { message: Errors.duplicate })
export class User {
  @Field()
  _id?: string;

  @Field()
  @prop({ required: true, unique: true })
  username!: string;

  @Field()
  @prop({ required: true, unique: false })
  password!: string;

  @Field(() => [Device])
  @arrayProp({ ref: 'Device' })
  devices?: Ref<Device>[];
}

export const UserModel = getModelForClass(User);
