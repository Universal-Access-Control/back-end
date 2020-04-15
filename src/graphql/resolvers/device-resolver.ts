import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Device, DeviceModel } from '../../models/device';
import { DeviceInput } from '../types/device-types';
import { UserModel } from '../../models/user';
import mqttClient from '../../mqtt/services/client';

@Resolver()
export class DeviceResolver {
  @Query(() => Device, { nullable: false })
  async singleDevice(@Arg('id') id: string): Promise<Device | null> {
    return await DeviceModel.findById({ _id: id });
  }

  @Query(() => [Device])
  async allDevices(): Promise<Device[]> {
    return await DeviceModel.find().populate('user');
  }

  @Mutation(() => Device)
  async addDevice(@Arg('device') { name, deviceId, userId }: DeviceInput): Promise<Device> {
    // Add Device
    const newDevice = await DeviceModel.create({ name, deviceId, registered: true });
    await newDevice.save();

    // Add device to the user's devices list
    await UserModel.updateOne({ _id: userId }, { $push: { devices: newDevice._id } });

    // Confirm registration of device
    const topic = `${newDevice.deviceId}/registered`;
    mqttClient.client?.publish(topic, newDevice.status || 'Error');

    return newDevice;
  }

  @Mutation(() => Boolean)
  async removeDevice(@Arg('id') id: string): Promise<boolean> {
    await DeviceModel.deleteOne({ id });
    return true;
  }
}
