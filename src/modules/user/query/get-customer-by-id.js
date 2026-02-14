/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getCustomerById,
} = require('../../../repository/customer-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const getCustomerWithId = async (_, args, ctx) => {
  try {
    const { customerId } = args;

    const existingCustomer = await getCustomerById(customerId, ctx);
    if (!existingCustomer) {
      throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
    }

    return { customer: existingCustomer };
  } catch (error) {
    userLogger(`Error from getCustomerWithId > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getCustomerWithId;
