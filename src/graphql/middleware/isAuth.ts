import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../../@types/access-control';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new AuthenticationError('Access denied!');
  }

  return next();
};
