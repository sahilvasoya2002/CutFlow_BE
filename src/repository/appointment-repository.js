const moment = require('moment');

const defaultLogger = require('../logger');
const models = require('../schema');

const addAppointment = async (data, ctx) => {
  try {
    const { Appointment: AppointmentModel } = models;
    const appointment = await AppointmentModel.create(data);
    return appointment;
  } catch (error) {
    defaultLogger(`Error from addAppointment > ${error}`, ctx, 'error');
    throw error;
  }
};

const checkIfCustomerAppointmentExistsForToday = async ({
  shopId, customerId, ctx,
}) => {
  try {
    const { Appointment: AppointmentModel } = models;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointment = await AppointmentModel.findOne({
      shopId,
      customerId,
      appointmentAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['CANCELLED', 'COMPLETED'] },
    });
    return appointment;
  } catch (error) {
    defaultLogger(`Error from checkIfCustomerAppointmentExistsForToday > ${error}`, ctx, 'error');
    throw error;
  }
};

const fetchAppointments = async ({
  shopId, startDate, endDate, limit, offset, branchId, status, ctx,
}) => {
  try {
    const { Appointment: AppointmentModel } = models;
    const query = { isDeleted: false };

    if (shopId) {
      query.shopId = shopId;
    }

    if (branchId) {
      query.branchId = branchId;
    }

    if (startDate && endDate) {
      const startOfDay = moment(startDate, 'DD-MM-YYYY')
        .startOf('day')
        .toDate();

      const endOfDay = moment(endDate, 'DD-MM-YYYY')
        .endOf('day')
        .toDate();
      query.appointmentAt = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      query.status = status;
    }
    const appointments = await AppointmentModel.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ appointmentAt: -1 });

    const totalCount = await AppointmentModel.countDocuments(query);

    return { appointments, totalCount };
  } catch (error) {
    defaultLogger(`Error from fetchAppointments > ${error}`, ctx, 'error');
    throw error;
  }
};

const getAppointmentById = async (appointmentId, ctx) => {
  try {
    const { Appointment: AppointmentModel } = models;
    const appointment = await AppointmentModel.findById(appointmentId);
    return appointment;
  } catch (error) {
    defaultLogger(`Error from getAppointmentById > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateAppointmentData = async (appointmentId, data, ctx) => {
  try {
    const { Appointment: AppointmentModel } = models;
    const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId, data, { new: true });
    return appointment;
  } catch (error) {
    defaultLogger(`Error from updateAppointmentData > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = {
  addAppointment,
  checkIfCustomerAppointmentExistsForToday,
  fetchAppointments,
  getAppointmentById,
  updateAppointmentData,
};
