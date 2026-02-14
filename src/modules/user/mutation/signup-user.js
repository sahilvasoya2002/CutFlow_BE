
const { CustomApolloError } = require('../../../lib/error-handler');
const { hashPassword } = require('../../../repository/core-repository');
const { createUser, checkUserExistsByEmail } = require('../../../repository/user-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const signupUser = async (_, args, ctx) => {
  try {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      age,
      sex,
      password,
    } = args.data;

    const userExists = await checkUserExistsByEmail(email, ctx);
    if (userExists) {
      throw new CustomApolloError(getMessage('USER_ALREADY_EXISTS'));
    }
    const hashedPassword = await hashPassword(password);
    const userData = {
      firstName,
      lastName,
      email,
      countryCode,
      mobileNumber: phoneNumber,
      age,
      sex,
      password: hashedPassword,
    };
    const user = await createUser(userData, ctx);
    return { user, isSignup: true };
  } catch (error) {
    userLogger(`Error from signupUser > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = signupUser;
