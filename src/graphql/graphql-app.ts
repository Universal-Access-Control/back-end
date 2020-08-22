import 'reflect-metadata';
import debug from 'debug';
import mongoose from 'mongoose';
import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import { DeviceResolver } from './resolvers/device-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { formatError } from '../errors';

mongoose.connection.on('connected', async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const log = debug('Graphql:App');

  log('Starting Graphql server...');

  const schema = await buildSchema({
    resolvers: [DeviceResolver, UserResolver],
  });

  const server = new ApolloServer({
    schema,
    formatError,
    debug: true,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const corsOptions = {
    credentials: true,
    origin: process.env.CORS_ORIGIN!,
  };

  const MongoStore = connectMongo(session);
  app.use(
    session({
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 1000 * 60 * 60 * 24, // 1 Day
      }),
      name: 'qid',
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: !dev,
        maxAge: 1000 * 60 * 60 * 24, // 1 Day
      },
    }),
  );

  if (!dev) {
    app.set('trust proxy', 1); // trust first proxy
  }

  server.applyMiddleware({ app, cors: corsOptions });

  const port = parseInt(process.env.GRAPHQL_PORT!, 10);
  app.listen(port, (err) => {
    if (err) throw new Error(err);

    log(`🚀  Server ready at http://localhost:${port}/graphql`);
  });
});
