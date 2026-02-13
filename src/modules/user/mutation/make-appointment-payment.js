/* eslint-disable no-await-in-loop */
const PAYMENT_STATUS = require('../../../constant/payment-status-constant');
const TRANSACTION_TITLE = require('../../../constant/transaction-title-constant');
const { CustomApolloError } = require('../../../lib/error-handler');
const { getAppointmentById, updateAppointmentData } = require('../../../repository/appointment-repository');
const {
  getBookById,
  getCustomerById,
  updateCustomerData,
  updateBook,
} = require('../../../repository/customer-repository');
const { createTransaction } = require('../../../repository/transaction-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const makeAppointmentPayment = async (_, { data }, ctx) => {
  try {
    const {
      appointmentId,
      amount,
      cashAmount = 0,
      upiAmount = 0,
      isAmountPaid,
      appointmentAmount,
      paymentVia,
      note,
    } = data;

    const paidAmount = cashAmount + upiAmount;

    if (paidAmount > amount) {
      throw new CustomApolloError('Paid amount cannot be greater than total amount');
    }

    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      throw new CustomApolloError(getMessage('APPOINTMENT_NOT_FOUND'));
    }

    const customer = await getCustomerById(appointment.customerId);
    if (!customer) {
      throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
    }

    const book = await getBookById(customer.bookId);
    if (!book) {
      throw new CustomApolloError(getMessage('BOOK_NOT_FOUND'));
    }

    const {
      appointmentAt,
      branchId,
      shopId,
      note: existingNote,
    } = appointment;

    const {
      id: customerId,
      name: customerName,
      bookId,
      dueAmount: existingCustomerDueAmount,
    } = customer;

    const { dueAmount: existingBookDueAmount } = book;

    let dueAmount = 0;
    let transactionTitle;

    // 🔹 Payment Logic
    if (isAmountPaid) {
      if (paidAmount < amount) {
        dueAmount = amount - paidAmount;
        transactionTitle = TRANSACTION_TITLE.PARTIALLY;
      } else {
        transactionTitle = TRANSACTION_TITLE.PAID;
      }
    } else {
      dueAmount = amount;
      transactionTitle = TRANSACTION_TITLE.NOT_PAID;
    }

    // 🔹 Update Due if exists
    if (dueAmount > 0) {
      await Promise.all([
        updateCustomerData(customerId, {
          dueAmount: existingCustomerDueAmount + dueAmount,
        }),
        updateBook(bookId, {
          dueAmount: existingBookDueAmount + dueAmount,
        }),
      ]);
    }

    // 🔹 Create Transaction
    await createTransaction({
      branchId,
      customerId,
      amount,
      paidAmount: isAmountPaid ? paidAmount : 0,
      cashAmount: isAmountPaid ? cashAmount : 0,
      upiAmount: isAmountPaid ? upiAmount : 0,
      dueAmount,
      bookId,
      shopId,
      appointmentAt,
      appointmentId,
      isDuePayment: false,
      customerName,
      paymentVia: isAmountPaid ? paymentVia : 'PENDING',
      title: transactionTitle,
      transactionId: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    // 🔹 Update Appointment
    await updateAppointmentData(appointmentId, {
      totalAmount: amount,
      appointmentAmount,
      paymentVia,
      status: PAYMENT_STATUS.COMPLETED,
      paymentStatus: paidAmount < amount
        ? PAYMENT_STATUS.PARTIAL
        : PAYMENT_STATUS.PAID,
      note: note || existingNote,
    });

    return true;
  } catch (error) {
    userLogger(`Error from makeAppointmentPayment > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = makeAppointmentPayment;
