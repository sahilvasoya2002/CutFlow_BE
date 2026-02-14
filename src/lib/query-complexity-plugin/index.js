const { separateOperations } = require('graphql');
const { getComplexity, simpleEstimator } = require('graphql-query-complexity');

const CONFIG = require('../../config/config');
const { logger } = require('../../logger');
const { getMessage } = require('../../utils/messages');
const { CustomApolloError } = require('../error-handler');

const queryComplexityPlugin = schema => ({
  requestDidStart: () => ({
    didResolveOperation({ request, document }) {
      const complexity = getComplexity({
        schema,
        query: request.operationName
          ? separateOperations(document)[request.operationName]
          : document,
        variables: request.variables,
        estimators: [
          simpleEstimator({
            defaultComplexity: 1,
          }),
        ],
      });
      const { COMPLEXITY_THRESHOLD } = CONFIG;
      if (complexity >= COMPLEXITY_THRESHOLD) {
        logger.info(`EXCEEDED_QUERY_COMPLEXITY : ${complexity}`);
        throw new CustomApolloError(getMessage('INVALID_REQUEST'));
      }
    },
  }),
});

module.exports = queryComplexityPlugin;
