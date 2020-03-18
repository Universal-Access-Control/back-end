const debug = require('debug')('MQTT:Router');
const Houkou = require('houkou');

function Router() {
  this.routes = [];
}

Router.prototype.add = function(url, opts, handler) {
  if (typeof opts === 'function') {
    handler = opts;
    opts = null;
  }
  
  const clientId = process.env.MQTT_CLIENT_ID || 'MQTT-Server';
  const safeUrl = `${clientId}/${url.replace(/\$/, '\\$')}`;
  const safeTopic = safeUrl.replace(/:[a-zA-Z0-9]+/g, '+');

  const route = this.routes.find(route => route.topic === safeTopic);
  if (route) {
    debug('Duplicate route: %s', url);
    process.exit(1);
  }

  this.routes.push({
    handler,
    opts,
    url: new Houkou(safeUrl),
    topic: safeTopic
  });

  return this;
};

module.exports = Router;
