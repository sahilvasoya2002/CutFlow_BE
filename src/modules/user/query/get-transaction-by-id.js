/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getTransactionById,
} = require('../../../repository/transaction-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const getTransactionWithId = async (_, args, ctx) => {
  try {
    const { transactionId } = args;

    const existingTransaction = await getTransactionById(transactionId, ctx);
    if (!existingTransaction) {
      throw new CustomApolloError(getMessage('TRANSACTION_NOT_FOUND'));
    }

    return { transaction: existingTransaction };
  } catch (error) {
    userLogger(`Error from getTransactionWithId > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getTransactionWithId;
