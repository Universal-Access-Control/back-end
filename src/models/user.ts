import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass, Ref, plugin, modelOptions } from '@typegoose/typegoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Device } from './device';
import { Errors } from '../errors';
'complete user registration';
@ObjectType({ description: 'User model' })
@plugin(uniqueValidator, { message: Errors.duplicate })
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Field()
  _id?: string;

  @Field()
  @prop({
    set: (value) => (!value ? '' : value),
    get: (value) => value,
  })
  firstName?: string;

  @Field()
  @prop({
    set: (value) => (!value ? '' : value),
    get: (value) => value,
  })
  lastName?: string;

  @Field()
  @prop({ required: true, unique: true, index: true, lowercase: true })
  email!: string;

  @prop({ required: true, unique: false })
  password!: string;

  @Field(() => [Device])
  @prop({ ref: Device })
  devices?: Ref<Device>[];

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}

export const UserModel = getModelForClass(User);
