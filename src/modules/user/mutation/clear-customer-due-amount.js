/* eslint-disable no-await-in-loop */
const TRANSACTION_TITLE = require('../../../constant/transaction-title-constant');
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getBookById,
  updateBook,
} = require('../../../repository/customer-repository');
const {
  getCustomerById,
  updateCustomerData,
} = require('../../../repository/customer-repository');
const { createTransaction } = require('../../../repository/transaction-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const clearDueCustomerAmount = async (_, { data }, ctx) => {
  try {
    const {
      customerId,
      branchId,
      upiAmount = 0,
      cashAmount = 0,
      paymentVia,
    } = data;

    const paidAmount = upiAmount + cashAmount;

    if (paidAmount <= 0) {
      throw new CustomApolloError('Paid amount must be greater than 0');
    }

    const customer = await getCustomerById(customerId);
    if (!customer) {
      throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
    }

    const {
      name: customerName,
      shopId,
      bookId,
      dueAmount: existingCustomerDueAmount,
    } = customer;

    if (paidAmount > existingCustomerDueAmount) {
      throw new CustomApolloError(getMessage('PAID_AMOUNT_EXCEEDS_DUE'));
    }

    const bookDetails = await getBookById(bookId);
    if (!bookDetails) {
      throw new CustomApolloError(getMessage('BOOK_NOT_FOUND'));
    }

    const { dueAmount: existingBookDue } = bookDetails;
    const updateCustomer = {};
    let transactionData = {
      branchId,
      customerId,
      customerName,
      paidAmount,
      cashAmount,
      upiAmount,
      bookId,
      shopId,
      isDuePayment: true,
      paymentVia,
      appointmentAt: null,
      appointmentId: null,
      transactionId: Math.floor(100000 + Math.random() * 900000).toString(),
    };

    let finalBookDue;
    if (paidAmount < existingCustomerDueAmount) {
      const updatedDue = Math.max(0, existingCustomerDueAmount - paidAmount);
      updateCustomer.dueAmount = updatedDue;
      finalBookDue = Math.max(0, existingBookDue - paidAmount);

      transactionData = {
        ...transactionData,
        title: TRANSACTION_TITLE.PARTIAL_DUE,
        amount: paidAmount,
        dueAmount: updatedDue,
      };
    } else if (paidAmount === existingCustomerDueAmount) {
      // Complete due payment
      updateCustomer.dueAmount = 0;
      finalBookDue = Math.max(0, existingBookDue - paidAmount);

      transactionData = {
        ...transactionData,
        title: TRANSACTION_TITLE.COMPLETE_DUE,
        amount: paidAmount,
        dueAmount: 0,
      };
    }

    await createTransaction(transactionData);
    await updateBook(bookId, { dueAmount: finalBookDue });
    await updateCustomerData(customerId, updateCustomer);
    return true;
  } catch (error) {
    userLogger(`Error from clearDueCustomerAmount > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = clearDueCustomerAmount;
