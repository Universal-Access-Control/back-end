const to = require('await-to-js').default;

const MqttRouter = require('../services/router');
const mqttClient = require('../services/client');
const DeviceModel = require('../models/device');

const authRouter = new MqttRouter();

authRouter.add('checkRegistered', async message => {
  const deviceId = message.toString();
  const [err, device] = await to(DeviceModel.findOne({ deviceId }));

  mqttClient.client.publish(
    `${deviceId}/registered`,
    err || !device ? 'ERROR' : device.status
  );
});

module.exports = authRouter;
