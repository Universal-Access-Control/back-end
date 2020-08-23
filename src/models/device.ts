import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass, plugin, modelOptions } from '@typegoose/typegoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Errors } from '../errors';

@ObjectType({ description: 'Device model' })
@plugin(uniqueValidator, { message: Errors.duplicate })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Device {
  @Field()
  _id?: string;

  @Field()
  @prop({ required: true, unique: true })
  deviceId!: string;

  @Field()
  @prop({ required: true })
  name!: string;

  @Field()
  @prop({ required: false, default: true })
  isActive!: boolean;

  @Field()
  @prop({ required: false, default: false })
  registered!: boolean;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  get status(): string {
    return !this.isActive ? 'DEACTIVATE' : this.registered ? 'REGISTERED' : 'UNREGISTER';
  }
}

export const DeviceModel = getModelForClass(Device);
