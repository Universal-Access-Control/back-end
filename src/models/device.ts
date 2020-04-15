import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass, plugin } from '@typegoose/typegoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Errors } from '../errors';

const randomName = (): string => `D-${(Math.random() + 1).toString(36).substr(2, 12)}`;
@ObjectType({ description: 'Device model' })
@plugin(uniqueValidator, { message: Errors.duplicate })
export class Device {
  @Field()
  @prop({ required: true, unique: true })
  deviceId!: string;

  @Field()
  @prop({ required: true, default: randomName })
  name?: string;

  @Field()
  @prop({ required: true, default: true })
  isActive?: boolean;

  @Field()
  @prop({ required: false, default: false })
  registered?: boolean;

  get status(): string {
    return !this.isActive ? 'DEACTIVATE' : this.registered ? 'REGISTERED' : 'UNREGISTER';
  }
}

export const DeviceModel = getModelForClass(Device);
