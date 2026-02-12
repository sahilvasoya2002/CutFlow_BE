/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  updateCustomerData, getCustomerById,
} = require('../../../repository/customer-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const updateCustomer = async (_, { data }, ctx) => {
  try {
    const {
      name,
      age,
      countryCode,
      phoneNumber,
      sex,
      address,
      customerId,
    } = data;

    const existingCustomer = await getCustomerById(customerId, ctx);
    if (!existingCustomer) {
      throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
    }

    const customer = await updateCustomerData(
      customerId,
      {
        name,
        age,
        countryCode,
        phoneNumber,
        sex,
        address,
      },
      ctx,
    );

    return { customer };
  } catch (error) {
    userLogger(`Error from updateCustomer > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = updateCustomer;
