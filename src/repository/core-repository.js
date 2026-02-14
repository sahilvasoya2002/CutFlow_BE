/* eslint-disable no-return-await */

const bcrypt = require('bcryptjs');

const defaultLogger = require('../logger');

const getCurrentMaxOrMin = async (model, property, order, ctx) => {
  try {
    const conditionToSort = {};
    // eslint-disable-next-line security/detect-object-injection
    conditionToSort[property] = order;
    const response = await model.findOne().sort(conditionToSort);
    let count = 0;
    if (response) {
      // eslint-disable-next-line security/detect-object-injection
      count = response[property];
    }
    return count - order;
  } catch (error) {
    defaultLogger(`Error from getCurrentMaxOrMin > ${error}`, ctx, 'error');
    throw error;
  }
};
const hashPassword = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  getCurrentMaxOrMin,
  hashPassword,
};
