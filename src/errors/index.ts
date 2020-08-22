import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
import _ from 'underscore';

type ResponseError = GraphQLFormattedError<Record<string, any>>;
type InputErrors = { [name: string]: string[] }[];

export const Errors = {
  duplicate: '{PATH} already exist.',
};

export const formatError = (error: GraphQLError): ResponseError => {
  if (error.originalError instanceof ArgumentValidationError) {
    const { validationErrors } = error.originalError;
    const errors: InputErrors = [];
    validationErrors.map((err) => {
      errors.push({
        [err.property]: Object.values(err.constraints || {}),
      });
    });

    return new UserInputError('Invalid Inputs', { errors });
  }

  if (error.originalError instanceof AuthenticationError) {
    return _.pick(error.originalError, 'message', 'extensions');
  }

  return new ApolloError('Internal Server Error', 'INTERNAL_SERVER_ERROR');
};
