const AppointmentStatus = require('./appointment.status');
const PaymentMethod = require('./payment.method');
const PaymentStatus = require('./payment.status');
const Sex = require('./sex.enum');

const enums = {
  Sex,
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
};

module.exports = enums;
