const { checkGraphQLStatus } = require('./query');

const resolver = {
  Query: {
    checkGraphQLStatus,
    helloWorld: () => 'Hello, World!',
  },
};

module.exports = resolver;
