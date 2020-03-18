const MQTT = require('async-mqtt');
const to = require('await-to-js').default;
const debug = require('debug')('MQTT:Client');

function MqttClient() {
  this.routes = [];
  this.client = null;
}

MqttClient.prototype.connect = async function() {
  const mqttUrl = process.env.MQTT_URL || 'mqtt://localhost';
  const mqttPort = parseInt(process.env.MQTT_PORT) || 1883;
  const options = {
    clientId: process.env.MQTT_CLIENT_ID || 'MQTT-Server',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
  };

  debug(`Connecting to ${mqttUrl}:${mqttPort}...`);
  const [err, client] = await to(MQTT.connectAsync(`${mqttUrl}:${mqttPort}`, options, true));  
  if (err) {
    debug('Connection Error : %O', err);
    process.exit(1);
  }

  this.client = client;
  debug('Connected to broker!');
};

MqttClient.prototype.useRouter = function(router) {
  router.routes.forEach(route => {
    const endpoint = this.routes.find(route => route.topic === safeTopic);
    if (endpoint) {
      debug('Duplicate route: %s', route);
      process.exit(1);
    }

    this.routes.push(route);
    this.client.subscribe(route.topic, route.opts);
  });
};

MqttClient.prototype.start = function() {
  this.client.on('message', (topic, message) => {
    this.routes.forEach(route => {
      const params = route.url.match(topic);

      if (params) {
        route.handler(topic, message, params, this.client);
      }
    });
  });
};

module.exports = MqttClient;
