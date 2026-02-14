/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const { CustomApolloError } = require('../../../lib/error-handler');
const {
  checkIfCustomerAppointmentExistsForToday,
  addAppointment,
} = require('../../../repository/appointment-repository');
const { getCustomerById } = require('../../../repository/customer-repository');
const userLogger = require('../user-logger');

const createAppointment = async (_, { data }, ctx) => {
  try {
    const { id: userId } = ctx.user;
    const { customerIds, shopId, branchId } = data;

    for (const customerId of customerIds) {
      const appointmentExists = await checkIfCustomerAppointmentExistsForToday({
        customerId,
        shopId,
        branchId,
        ctx,
      });

      if (appointmentExists) {
        const customer = await getCustomerById(customerId, ctx);
        throw new CustomApolloError(`Appointment already exists for ${customer.name}`);
      }

      await addAppointment(
        {
          customerId,
          userId,
          shopId,
          branchId,
        },
        ctx,
      );
    }

    return { appointmentCreated: true };
  } catch (error) {
    userLogger(`Error from createAppointment > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = createAppointment;
