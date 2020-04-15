import mongoose from 'mongoose';
import debug from 'debug';
import to from 'await-to-js';
import mqttClient from './services/client';
import authRouter from './routes/auth';

const log = debug('MQTT:App');

mongoose.connection.on('connected', async () => {
  const [err] = await to(mqttClient.connect());
  if (err) {
    log(err);
    process.exit(1);
  }

  log('Subscribing topics...');
  mqttClient.useRouter(authRouter);
  log('Topics subscribed!');
  mqttClient.start();
});
