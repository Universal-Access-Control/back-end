import MQTT, { IMqttClient, IClientOptions } from 'async-mqtt';
import to from 'await-to-js';
import debug from 'debug';
import { Router, Route } from './router';

// Interfaces
interface MqttClient {
  routes: Route[];
  client: IMqttClient | undefined;
  connect(): Promise<void>;
  useRouter(router: Router): void;
  start(): void;
}

// Codes
const log = debug('MQTT:Client');

const MqttClient = (function (this: MqttClient): void {
  this.routes = [];
  this.client = undefined;
} as unknown) as { new (): MqttClient };

MqttClient.prototype.connect = async function (): Promise<void> {
  const mqttUrl = process.env.MQTT_URL;
  const mqttPort = parseInt(process.env.MQTT_PORT);
  const options: IClientOptions = {
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  log(`Connecting to ${mqttUrl}:${mqttPort}...`);
  const [err, client] = await to(MQTT.connectAsync(`${mqttUrl}:${mqttPort}`, options, true));
  if (err) {
    log('Connection Error : %O', err);
    process.exit(1);
  }

  this.client = client;
  log('✅  Connected to broker!');
};

MqttClient.prototype.useRouter = function (this: MqttClient, router: Router): void {
  router.routes.map((route) => {
    const endpoint = this.routes.find((r) => r.topic === route.topic);
    if (endpoint) {
      log('Duplicate route: %s', route);
      process.exit(1);
    }

    this.routes.push(route);
    this.client?.subscribe(route.topic, route.opts);
  });
};

MqttClient.prototype.start = function (this: MqttClient): void {
  this.client?.on('message', (topic, message) => {
    this.routes.forEach((route) => {
      const params = route.url.match(topic);

      if (params && route.handler) {
        route.handler(message, params, this.client);
      }
    });
  });
  log('✅  MQTT client started successfully!');
};

const mqttClient = new MqttClient();
export default mqttClient;
