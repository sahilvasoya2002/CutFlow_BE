module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  MONGO_URI: process.env.MONGO_URI,
  APP_URL: process.env.APP_URL,
  USE_PRETTY_PRINT: process.env.USE_PRETTY_PRINT === 'true',
  PRIMARY_SERVER_URL: process.env.PRIMARY_SERVER_URL,
  // SECURITY
  DEPTH_LIMIT_CONFIG: Number(process.env.QUERY_DEPTH_LIMIT) || 5,
  QUERY_LENGTH_LIMIT: Number(process.env.QUERY_LENGTH_LIMIT) || 5000,
  // COMPLEXITY_THRESHOLD: Number(process.env.COMPLEXITY_THRESHOLD) || 300,
  COMPLEXITY_THRESHOLD: 300,
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    LIFE_TIME: process.env.JWT_LIFE_TIME || '7d',
  },
  APOLLO_STUDIO_CONFIG: {
    key: process.env.APOLLO_KEY,
    graphId: process.env.APOLLO_GRAPH_ID,
    graphVariant: process.env.APOLLO_GRAPH_VARIANT,
  },
};
