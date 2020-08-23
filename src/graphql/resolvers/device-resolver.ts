import { Resolver, Mutation, Arg, Query, UseMiddleware, Ctx } from 'type-graphql';

import mqttClient from '../../mqtt/services/client';
import { Device, DeviceModel } from '../../models/device';
import { DeviceInput, UpdateDeviceInput } from '../types/device-types';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../../@types/access-control';
import { UserModel } from '../../models/user';
import { DocumentType } from '@typegoose/typegoose';

@Resolver()
export class DeviceResolver {
  @UseMiddleware(isAuth)
  @Query(() => Device, { nullable: true })
  async singleDevice(@Arg('id') id: string, @Ctx() ctx: MyContext): Promise<Device | null> {
    const user = await UserModel.findById({ _id: ctx.req.session!.userId }).populate('devices');
    const device = user?.devices?.find((device) => (device as Device)._id == id) as Device;

    return device;
  }

  @Query(() => [Device])
  @UseMiddleware(isAuth)
  async allDevices(@Ctx() ctx: MyContext): Promise<Device[]> {
    const user = await UserModel.findById({ _id: ctx.req.session!.userId }).populate('devices');

    return (user?.devices || []) as Device[];
  }

  @Mutation(() => Device)
  @UseMiddleware(isAuth)
  async addDevice(@Arg('device') { name, deviceId }: DeviceInput, @Ctx() ctx: MyContext): Promise<Device> {
    // Add Device
    // TODO: Check duplicate deviceId
    const userId = ctx.req.session!.userId;
    const device = new Device();
    device.name = name;
    device.deviceId = deviceId;
    device.registered = true;

    const newDevice = await DeviceModel.create(device);
    await newDevice.save();

    // Add device to the user's devices list
    await UserModel.updateOne({ _id: userId }, { $push: { devices: newDevice._id } });

    // Confirm registration of device
    const topic = `${newDevice.deviceId}/registered`;
    mqttClient.client?.publish(topic, newDevice.status || 'Error');

    return newDevice;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Device, { nullable: true })
  async updateDevice(@Arg('device') { id, name }: UpdateDeviceInput, @Ctx() ctx: MyContext): Promise<Device | null> {
    const user = await UserModel.findById({ _id: ctx.req.session!.userId }).populate('devices');
    const device = user?.devices?.find((device) => (device as Device)._id == id) as Device;

    device.name = name;
    await (device as DocumentType<Device>).save();

    return device;
  }
}
