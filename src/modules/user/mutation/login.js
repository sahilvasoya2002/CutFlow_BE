
const bcrypt = require('bcryptjs');

const { CustomApolloError } = require('../../../lib/error-handler');
const { checkUserExistsByEmail } = require('../../../repository/user-repository');
const generateToken = require('../../../utils/auth/generate-token');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const login = async (_, args, ctx) => {
  try {
    const { email, password } = args.data;

    const userExists = await checkUserExistsByEmail(email, ctx);
    if (!userExists) {
      throw new CustomApolloError(getMessage('USER_NOT_FOUND'));
    }
    const { id: userId, password: storedPassword } = userExists;

    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    if (!isPasswordValid) {
      throw new CustomApolloError(getMessage('INVALID_PASSWORD'));
    }

    const token = await generateToken(userId);

    return { user: userExists, token };
  } catch (error) {
    userLogger(`Error from login > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = login;
