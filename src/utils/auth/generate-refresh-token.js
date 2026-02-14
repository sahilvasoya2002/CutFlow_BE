const jwt = require('jsonwebtoken');

const CONFIG = require('../../config/config');

const JWT_SECRET = CONFIG.JWT.SECRET;

const generateRefreshToken = userId => new Promise((resolve, reject) => {
  jwt.sign({ userId }, JWT_SECRET, (error, token) => {
    if (error) {
      return reject(error);
    }
    resolve(token);
    return true;
  });
});

module.exports = generateRefreshToken;
