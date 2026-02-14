/* eslint-disable no-param-reassign */
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');

const { defaultFieldResolver } = require('graphql');

const { CustomApolloError } = require('../lib/error-handler');
const defaultLogger = require('../logger');
const getUser = require('../utils/auth/get-user');
const { getMessage } = require('../utils/messages');

const isUserAuthenticationManagementAccessDirectiveTransformer = (schema, directiveName) => mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: fieldConfig => {
    const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
    if (authDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        try {
          const user = await getUser(context);
          if (!user) {
            throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
          }
          context.user = user;
          return await resolve(source, args, context, info);
        } catch (err) {
          defaultLogger(`Error isUserAuthenticationManagementAccessDirectiveTransformer -> ${err}`, 'error');
          throw err;
        }
      };
    }
  },
});

module.exports = isUserAuthenticationManagementAccessDirectiveTransformer;
