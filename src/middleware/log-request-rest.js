const jwt = require('jsonwebtoken');
const { get } = require('lodash');
const { v4: uuid } = require('uuid');

const logRequest = (clientName = 'UNKNOWN') => (req, res, next) => {
  const token = req.headers.authorization;
  // const clientName = 'UNKNOWN';
  const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'NA';
  const requestId = uuid();
  let userId = 'UNAUTHENTICATED';

  if (token && token.startsWith('Bearer ')) {
    const authToken = token.slice(7, token.length);
    const decodedToken = jwt.decode(authToken);
    userId = get(decodedToken, 'sub');
  }

  const ctx = {
    clientName,
    reqIp,
    requestId,
    userId,
  };

  req.ctx = ctx || {};

  return next();
};

module.exports = { logRequest };
