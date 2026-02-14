const { CustomAuthenticationError } = require('../../lib/error-handler/index');
const defaultLogger = require('../../logger');
const { User: UserModel } = require('../../schema/index');
const { getMessage } = require('../messages');

const getDecodedToken = require('./get-decoded-token');

const getUser = async (ctx, localeService) => {
  const { req } = ctx;

  if (!req) {
    return null;
  }

  const token = req.headers.authorization;
  if (!token) {
    throw new CustomAuthenticationError(getMessage('NOT_LOGGED_IN'));
  }

  if (!token.startsWith('Bearer ')) {
    throw new CustomAuthenticationError(getMessage('INVALID_TOKEN'));
  }
  const authToken = token.slice(7, token.length);

  try {
    const decodedToken = await getDecodedToken(authToken, localeService);
    const user = await UserModel.findOne({ _id: decodedToken.userId, isDeleted: false });
    return user;
  } catch (error) {
    defaultLogger(`Error from getUser > ${error}`, null, 'error');
    throw error;
  }
};

module.exports = getUser;
