
// customAuthenticationError.js
const { GraphQLError } = require('graphql');

class CustomForbiddenError extends GraphQLError {
  constructor(message, code = 'CUSTOM_FORBIDDEN_ERROR') {
    super(message, {
      extensions: { code },
    });
  }
}

module.exports = { CustomForbiddenError };
