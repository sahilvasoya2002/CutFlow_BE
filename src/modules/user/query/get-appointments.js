/* eslint-disable no-underscore-dangle */
const {
  fetchAppointments,
} = require('../../../repository/appointment-repository');
const userLogger = require('../user-logger');

const getAppointments = async (_, { data }, ctx) => {
  try {
    const {
      shopId, startDate, endDate, limit, offset, branchId, status,
    } = data;

    
    const { appointments, totalCount } = await fetchAppointments({
      shopId, startDate, endDate, limit, offset, branchId, status, ctx,
    });

    return { appointments, totalCount };
  } catch (error) {
    userLogger(`Error from getAppointments > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getAppointments;
