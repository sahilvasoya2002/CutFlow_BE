const getBranchWithId = require('../query/get-branch-by-id');

const createCustomer = require('./create-customer');
const createAppointment = require('./create-new-appointment');
const createShop = require('./create-shop');
const login = require('./login');
const makeAppointmentPayment = require('./make-appointment-payment');
const removeCustomer = require('./remove-patient');
const signupUser = require('./signup-user');
const updateBranch = require('./update-branch');
const updateCustomer = require('./update-customer');
const updateShop = require('./update-shop');

module.exports = {
  login,
  signupUser,
  createShop,
  updateShop,
  updateBranch,
  createCustomer,
  removeCustomer,
  getBranchWithId,
  updateCustomer,
  createAppointment,
  makeAppointmentPayment,
};
