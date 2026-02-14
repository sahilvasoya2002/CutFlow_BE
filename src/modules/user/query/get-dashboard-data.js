const moment = require('moment');

const { Types } = require('mongoose');

const APPOINTMENT_STATUS = require('../../../constant/appointment-status-constant');
const {
  Appointment, Book, Customer, Transaction,
} = require('../../../schema/index');
const userLogger = require('../user-logger');

const getDateWiseDashboardData = async (_, { data }, ctx) => {
  try {
    const {
      startDate,
      endDate,
      branchId,
      shopId,
    } = data;

    if (!startDate || !endDate) {
      throw new Error('Invalid date range');
    }

    // ✅ Convert date safely
    const startOfDay = moment(startDate, 'DD-MM-YYYY')
      .startOf('day')
      .toDate();

    const endOfDay = moment(endDate, 'DD-MM-YYYY')
      .endOf('day')
      .toDate();

    const baseFilter = {};
    if (branchId) baseFilter.branchId = Types.ObjectId.createFromHexString(branchId);
    if (shopId) baseFilter.shopId = Types.ObjectId.createFromHexString(shopId);

    const shopObjectId = Types.ObjectId.createFromHexString(shopId);

    const totalPatientsPromise = Customer.countDocuments({
      ...baseFilter,
      isDeleted: false,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalAppointmentsPromise = Appointment.countDocuments({
      ...baseFilter,
      isBranchDeleted: false,
      status: {
        $in: [
          APPOINTMENT_STATUS.PENDING,
          APPOINTMENT_STATUS.COMPLETED,
          APPOINTMENT_STATUS.ACTIVE,
          APPOINTMENT_STATUS.INPROGRESS,
        ],
      },
      appointmentAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const transactionMatch = {
      ...baseFilter,
      isReverted: false,
      isBranchDeleted: false,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };

    const transactionAggPromise = Transaction.aggregate([
      { $match: { ...transactionMatch, isDuePayment: false } },
      {
        $group: {
          _id: null,
          totalCashRevenue: { $sum: '$cashAmount' },
          totalUpiRevenue: { $sum: '$upiAmount' },
          totalDueRevenue: { $sum: '$dueAmount' },
        },
      },
    ]);

    const clearedDueAggPromise = Transaction.aggregate([
      { $match: { ...transactionMatch, isDuePayment: true } },
      {
        $group: {
          _id: null,
          totalClearedDueAmount: { $sum: '$paidAmount' },
          totalClearedDueCashAmount: { $sum: '$cashAmount' },
          totalClearedDueUpiAmount: { $sum: '$upiAmount' },
        },
      },
    ]);

    const totalAppointmentAmountPromise = Appointment.aggregate([
      {
        $match: {
          ...baseFilter,
          status: APPOINTMENT_STATUS.COMPLETED,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalAppointmentAmount: { $sum: '$appointmentAmount' },
        },
      },
    ]);

    const overallDuePromise = Book.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          isDeleted: false,
          dueAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          overallDueAmount: { $sum: '$dueAmount' },
        },
      },
    ]);

    const [
      totalPatients,
      totalAppointments,
      transactionAgg,
      clearedDueAgg,
      totalAppointmentAmountAgg,
      overallDueAgg,
    ] = await Promise.all([
      totalPatientsPromise,
      totalAppointmentsPromise,
      transactionAggPromise,
      clearedDueAggPromise,
      totalAppointmentAmountPromise,
      overallDuePromise,
    ]);

    const transactionData = transactionAgg[0] || {};
    const clearedData = clearedDueAgg[0] || {};
    const appointmentData = totalAppointmentAmountAgg[0] || {};
    const overallDueData = overallDueAgg[0] || {};

    return {
      totalPatients,
      totalAppointments,
      totalCashRevenue: transactionData.totalCashRevenue || 0,
      totalUpiRevenue: transactionData.totalUpiRevenue || 0,
      totalRevenue:
        (transactionData.totalCashRevenue || 0)
        + (transactionData.totalUpiRevenue || 0),
      totalDueRevenue: transactionData.totalDueRevenue || 0,
      totalAppointmentAmount: appointmentData.totalAppointmentAmount || 0,
      overallDueAmount: overallDueData.overallDueAmount || 0,
      totalClearedDueAmount: clearedData.totalClearedDueAmount || 0,
      totalClearedDueCashAmount: clearedData.totalClearedDueCashAmount || 0,
      totalClearedDueUpiAmount: clearedData.totalClearedDueUpiAmount || 0,
      totalClearedDueRevenue:
        (clearedData.totalClearedDueCashAmount || 0)
        + (clearedData.totalClearedDueUpiAmount || 0),
    };
  } catch (error) {
    userLogger(`Error from getCustomers > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getDateWiseDashboardData;
