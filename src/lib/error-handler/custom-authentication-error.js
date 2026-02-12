// customAuthenticationError.js
const { GraphQLError } = require('graphql');

class CustomAuthenticationError extends GraphQLError {
  constructor(message, code = 'UNAUTHENTICATED') {
    super(message, {
      extensions: { code },
    });
  }
}

module.exports = { CustomAuthenticationError };
