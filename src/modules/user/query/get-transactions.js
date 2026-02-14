/* eslint-disable no-underscore-dangle */
const { fetchTransactions } = require('../../../repository/transaction-repository');
const userLogger = require('../user-logger');

const getTransactions = async (_, { data }, ctx) => {
  try {
    const {
      shopId, startDate, endDate, limit, offset, branchId, customerId, transactionType,
    } = data;

    const { transactions, totalCount } = await fetchTransactions({
      shopId, startDate, endDate, limit, offset, branchId, customerId, transactionType, ctx,
    });
    return { transactions, totalCount };
  } catch (error) {
    userLogger(`Error from getTransactions > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getTransactions;
