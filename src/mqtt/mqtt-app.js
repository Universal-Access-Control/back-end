const mongoose = require('mongoose');
const debug = require('debug')('MQTT:App');
const to = require('await-to-js').default;
const mqttClient = require('./services/client');
const authRouter = require('./routes/auth');


mqttClient.connect().then(async () => {
  debug('Connecting to database...');
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
  const dbBaseUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';

  const [err] = await to(mongoose.connect(`${dbBaseUrl}/mqtt`, dbOptions));
  if (err) {
    debug('Database connection error: %s', err);
    process.exit(1);
  }
  debug('Database connected!');

  debug('Subscribing topics...');
  mqttClient.useRouter(authRouter);
  debug('Topics subscribed!');
  mqttClient.start();
});
