import mongoose from 'mongoose';
import debug from 'debug';
import to from 'await-to-js';
import mqttClient from './services/client';
import authRouter from './routes/auth';

const log = debug('MQTT:App');

mqttClient
  .connect()
  .then(async () => {
    log('Connecting to database...');
    const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
    const dbBaseUrl = process.env.MONGODB_URL;

    const [err] = await to(mongoose.connect(`${dbBaseUrl}/mqtt`, dbOptions));
    if (err) {
      log('Database connection error: %s', err);
      process.exit(1);
    }
    log('Database connected!');

    log('Subscribing topics...');
    mqttClient.useRouter(authRouter);
    log('Topics subscribed!');
    mqttClient.start();
  })
  .catch((err) => debug(err));
