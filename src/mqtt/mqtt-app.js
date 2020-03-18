const MqttClient = require('./services/client');

const mqttClient = new MqttClient();

mqttClient.connect().then(() => {
  mqttClient.start();
});
