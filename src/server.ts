import 'dotenv-defaults/config';
import debug from 'debug';
import mongoose from 'mongoose';
import to from 'await-to-js';
import './mqtt/mqtt-app';
import './graphql/graphql-app';

(async (): Promise<void> => {
  const log = debug('Server');

  log('Connecting to database...');
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
  const dbBaseUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME;

  const [err] = await to(mongoose.connect(`${dbBaseUrl}/${dbName}`, dbOptions));
  if (err) {
    log('Database connection error: %s', err);
    process.exit(1);
  }
  log('🔥  Database connected!');
})();
