import to from 'await-to-js';
import MqttRouter from '../services/router';
import mqttClient from '../services/client';
import DeviceModel from '../../models/device';

const authRouter = new MqttRouter();

authRouter.add('checkRegistered', async (message: Buffer) => {
  // Fetch Device from db
  const findOpts = { deviceId: message.toString() };
  const [err, device] = await to(DeviceModel.findOne(findOpts).exec());

  // Send status of device
  if (!err && device) {
    const topic = `${device.deviceId}/registered`;
    mqttClient.client?.publish(topic, device?.status || 'Error');
  }
});

export default authRouter;
