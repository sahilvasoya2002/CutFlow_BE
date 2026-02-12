const getAppointments = require('./get-appointments');
const getBooks = require('./get-books');
const getBranchWithId = require('./get-branch-by-id');
const getBranches = require('./get-branches');
const getCustomerWithId = require('./get-customer-by-id');
const getCustomers = require('./get-customers');
const getShopWithId = require('./get-shop-by-id');

module.exports = {
  getBranchWithId,
  getCustomerWithId,
  getShopWithId,
  getBranches,
  getCustomers,
  getBooks,
  getAppointments,
};
