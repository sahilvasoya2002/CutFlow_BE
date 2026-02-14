const { GraphQLError } = require('graphql');

class CustomApolloError extends GraphQLError {
  constructor(message, code = 'CUSTOM_APOLLO_ERROR') {
    super(message, {
      extensions: { code },
    });
  }
}

module.exports = { CustomApolloError };
