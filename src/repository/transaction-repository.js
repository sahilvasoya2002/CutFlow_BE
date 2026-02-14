const moment = require('moment');

const defaultLogger = require('../logger');
const models = require('../schema');

const createTransaction = async (data, ctx) => {
  try {
    const { Transaction: TransactionModel } = models;
    const transaction = await TransactionModel.create(data);
    return transaction;
  } catch (error) {
    defaultLogger(`Error from createTransaction > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateTransactionData = async (transactionId, data, ctx) => {
  try {
    const { Transaction: TransactionModel } = models;
    const transaction = await TransactionModel.findByIdAndUpdate(transactionId, data, { new: true });
    return transaction;
  } catch (error) {
    defaultLogger(`Error from updateTransactionData > ${error}`, ctx, 'error');
    throw error;
  }
};

const getTransactionById = async (transactionId, ctx) => {
  try {
    const { Transaction: TransactionModel } = models;
    const transaction = await TransactionModel.findById(transactionId);
    return transaction;
  } catch (error) {
    defaultLogger(`Error from getTransactionById > ${error}`, ctx, 'error');
    throw error;
  }
};

const fetchTransactions = async ({
  shopId, startDate, endDate, limit, offset, branchId, customerId, transactionType, ctx,
}) => {
  try {
    const { Transaction: TransactionModel } = models;
    const query = { isReverted: false };

    if (shopId) {
      query.shopId = shopId;
    }

    if (branchId) {
      query.branchId = branchId;
    }

    if (transactionType !== 'DUE') {
      query.paymentVia = transactionType;
    }

    if (transactionType === 'DUE') {
      query.dueAmount = { $gt: 0 };
    }

    if (startDate && endDate) {
      const startOfDay = moment(startDate, 'DD-MM-YYYY')
        .startOf('day')
        .toDate();

      const endOfDay = moment(endDate, 'DD-MM-YYYY')
        .endOf('day')
        .toDate();
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    if (customerId) {
      query.customerId = customerId;
    }

    const transactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const totalCount = await TransactionModel.countDocuments(query);

    return { transactions, totalCount };
  } catch (error) {
    defaultLogger(`Error from fetchTransactions > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = {
  createTransaction,
  updateTransactionData,
  getTransactionById,
  fetchTransactions,
};
