/* eslint-disable max-len */
/* eslint-disable max-lines */
require('dotenv').config();

const http = require('http');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } = require('@apollo/server/plugin/landingPage/default');
const { makeExecutableSchema } = require('@graphql-tools/schema');
// const Sentry = require('@sentry/node');
const cors = require('cors');
const express = require('express');
const { constraintDirectiveTypeDefs, constraintDirective } = require('graphql-constraint-directive');
const createGraphQLLogger = require('graphql-log');

const jwt = require('jsonwebtoken');
const { get } = require('lodash');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const CONFIG = require('./config/config');
const urlConstants = require('./constant/url-constant');
const applyDirective = require('./directives');
const depthLimitRule = require('./lib/depth-limit-rule');
// const { CustomAuthenticationError } = require('./lib/error-handler');

const queryComplexityPlugin = require('./lib/query-complexity-plugin');
const { logger } = require('./logger');
const { logRequest } = require('./middleware/log-request-rest');
const { resolvers, typeDefs } = require('./modules');
const restModules = require('./rest');
// const { validateToken } = require('./utils/context');
const { getMessage } = require('./utils/messages');

// Initialize express app
const app = express();

// Set up CORS
const corsOptions = {
  credentials: true,
  origin: true,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Query length validation middleware
app.use('*', (req, res, next) => {
  const query = req.query.query || req.body.query || '';
  const { QUERY_LENGTH_LIMIT } = CONFIG;
  if (query.length > QUERY_LENGTH_LIMIT) {
    logger.info(`QUERY LENGTH EXCEEDED ${QUERY_LENGTH_LIMIT} => ${query.length}`);
    res.status(400).send({
      errors: [{
        message: 'INVALID REQUEST',
      }],
    });
  }
  next();
});

// Rest api middleware
app.use(urlConstants.API_PREFIX_URL, logRequest(), restModules);

const logExecutions = createGraphQLLogger({
  logger: logger.debug,
});

logExecutions(resolvers);

// Make GraphQL schema executable
let schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers,
});
schema = constraintDirective()(schema); // Apply constraint directive
schema = applyDirective(schema); // Applying custom directives

// Apollo server setup
async function startApolloServer() {
  try {
    const server = new ApolloServer({
      schema,
      introspection: ['localhost', 'dev', 'development', 'staging'].includes(CONFIG.ENV),
      playground: ['localhost', 'dev', 'development', 'staging'].includes(CONFIG.ENV),
      plugins: [
        queryComplexityPlugin(schema),
        // sentryGraphqlPlugin,
        // sentryLogsPlugin(Sentry),
        ['localhost', 'dev', 'development', 'staging'].includes(CONFIG.ENV)
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      formatError: error => {
        let message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '');

        if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
          return { ...error, message };
        }

        const { extensions: { code } } = error;

        if (!(code === 'CUSTOM_APOLLO_ERROR' || code === 'UNAUTHENTICATED' || code === 'CUSTOM_FORBIDDEN_ERROR')) {
          console.error('SERVER ERROR >>', error);
          message = getMessage('INTERNAL_SERVER_ERROR');
          return { message };
        }

        return { ...error, message };
      },
      context: async ctx => {
        if (ctx.connection) return { connection: ctx.connection };

        const token = ctx.req.headers.authorization;
        console.log('Authorization token:', token);
        let userId = 'UNAUTHENTICATED';
        if (token && token.startsWith('Bearer ')) {
          const authToken = token.slice(7);
          const decodedToken = jwt.decode(authToken);
          userId = get(decodedToken, 'sub');
        }
        ctx.userId = userId;
        ctx.clientName = ctx.req.headers['apollographql-client-name'] || 'UNKNOWN';
        ctx.reqIp = ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress || ctx.req.ip || 'NA';

        const requestId = uuid();
        ctx.requestId = requestId;
        return {
          ...ctx,
          req: ctx.req,
          res: ctx.res,
        };
      },
      // subscriptions: {
      //   path: '/graphql',
      //   onConnect: connectionParams => {
      //     if (['localhost'].includes(CONFIG.ENV)) {
      //       logger.info('------------onConnect---------------');
      //     }
      //     if (connectionParams && connectionParams.authorization) {
      //       return validateToken(connectionParams.authorization)
      //         .then(user => ({
      //           user,
      //         })).catch(err => {
      //           if (err instanceof CustomAuthenticationError) {
      //             throw err;
      //           }
      //           throw new CustomAuthenticationError('Not Authorized!');
      //         });
      //     }
      //     throw new Error('Missing auth token!');
      //   },
      //   onDisconnect: () => {
      //     if (['localhost'].includes(CONFIG.ENV)) {
      //       logger.info('------------onDisconnect---------------');
      //     }
      //   },
      // },
      validationRules: [depthLimitRule(CONFIG.DEPTH_LIMIT_CONFIG)],
    });

    await server.start();
    app.use('/graphql', expressMiddleware(server, {
      context: async ctx => {
        if (ctx.connection) return { connection: ctx.connection };
        return { ...ctx, req: ctx.req, res: ctx.res };
      },
    }));
  } catch (error) {
    logger.error(`ERROR STARTING APOLLO SERVER >> ${error}`);
    throw error;
  }
}

// MongoDB connection setup
mongoose.connect(CONFIG.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', async () => {
  console.log('Connected successfully to db');
  const httpServer = http.createServer(app);
  await startApolloServer(); // Start Apollo server after DB connection

  httpServer.listen(CONFIG.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${CONFIG.PORT}/graphql`);
    console.log(`WITH DEPTH_LIMIT of ${CONFIG.DEPTH_LIMIT_CONFIG}`);
  });
});

module.exports = app;
