const winston = require('winston');

const { defaultLoggerConfig } = require('../../logger');

const commonLoggerInstance = winston.createLogger({
  ...defaultLoggerConfig,
  defaultMeta: {
    service: 'common',
  },
});

const commonLogger = (message, ctx, level = 'info') => {
  // eslint-disable-next-line security/detect-object-injection
  commonLoggerInstance.child({
    requestId: ctx?.requestId,
    reqIp: ctx?.reqIp,
    userId: ctx?.userId,
  })[level](message);
};

module.exports = commonLogger;
