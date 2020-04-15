import 'reflect-metadata';
import debug from 'debug';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { DeviceResolver } from './resolvers/device-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { formatError } from '../errors';

mongoose.connection.on('connected', async () => {
  const log = debug('Graphql:App');
  log('Starting Graphql server...');

  const schema = await buildSchema({
    resolvers: [DeviceResolver, UserResolver],
  });
  const server = new ApolloServer({
    schema,
    formatError,
  });

  server.listen().then(({ url }) => {
    log(`🚀  Server ready at ${url}`);
  });
});
