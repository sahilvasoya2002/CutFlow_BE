/* eslint-disable prefer-destructuring */
/* eslint-disable no-trailing-spaces */
const crypto = require('crypto');

const CONFIG = require('../../config/config');
const defaultLogger = require('../../logger');

const PASSWORD_SALT = CONFIG.ENCRYPTION.PASSWORD_SALT;
const PASSWORD_INTERACTION = CONFIG.ENCRYPTION.PASSWORD_INTERACTION;

const generatePassword = password => {
  try {
    const hashPassword = crypto.pbkdf2Sync(password, PASSWORD_SALT, PASSWORD_INTERACTION, 64, 'sha512').toString('hex');
    return hashPassword;
  } catch (error) {
    defaultLogger(`Error from generatePassword => ${error}`, {}, 'error');
    throw error;
  }
};

const comparePassword = (password, hashPassword) => {
  try {
    const newHashedPassword = generatePassword(password);
    return newHashedPassword === hashPassword;
  } catch (error) {
    defaultLogger(`Error from generatePassword => ${error}`, {}, 'error');
    throw error;
  }
};

module.exports = {
  generatePassword,
  comparePassword,
};
