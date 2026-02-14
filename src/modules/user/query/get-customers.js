/* eslint-disable no-underscore-dangle */
const {
  fetchCustomers,
} = require('../../../repository/customer-repository');
const userLogger = require('../user-logger');

const getCustomers = async (_, { data }, ctx) => {
  try {
    const {
      shopId, branchId, limit, offset, search,
    } = data;

    const { customers, totalCount } = await fetchCustomers({
      shopId, branchId, limit, offset, search, ctx,
    });

    return { customers, totalCount };
  } catch (error) {
    userLogger(`Error from getCustomers > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getCustomers;
