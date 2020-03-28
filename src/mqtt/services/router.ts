import debug from 'debug';
import Houkou from 'houkou';
import { IClientSubscribeOptions, IMqttClient } from 'async-mqtt';

// Interfaces
declare type Handler = (message: Buffer, params: object, client?: IMqttClient) => void;
declare type OptionArg = IClientSubscribeOptions | Handler;
export interface Route {
  url: any;
  topic: string;
  opts: IClientSubscribeOptions;
  handler?: Handler;
}

export interface Router {
  routes: Route[];
  add(url: string, opts: OptionArg, handler?: Handler): void;
}

// Codes
const log = debug('MQTT:Router');

const Router = (function (this: Router) {
  this.routes = [];
} as unknown) as { new (): Router };

Router.prototype.add = function (this: Router, url: string, opts: OptionArg, handler?: Handler): Router {
  let options: IClientSubscribeOptions = { qos: 0 };
  [handler, options] = typeof opts === 'function' ? [opts, options] : [handler, opts];

  const clientId = process.env.MQTT_CLIENT_ID;
  const safeUrl = `${clientId}/${url.replace(/\$/, '\\$')}`;
  const safeTopic = safeUrl.replace(/:[a-zA-Z0-9]+/g, '+');

  const route = this.routes.find((route) => route?.topic === safeTopic);
  if (route) {
    log('Duplicate route: %s', url);
    process.exit(1);
  }

  this.routes.push({
    handler,
    opts: options,
    url: new Houkou(safeUrl),
    topic: safeTopic,
  });

  return this;
};

export default Router;
