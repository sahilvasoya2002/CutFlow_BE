const getAppointments = require('./get-appointments');
const getBooks = require('./get-books');
const getBranchWithId = require('./get-branch-by-id');
const getBranches = require('./get-branches');
const getCustomerWithId = require('./get-customer-by-id');
const getCustomers = require('./get-customers');
const getDashboardData = require('./get-dashboard-data');
const getShopWithId = require('./get-shop-by-id');
const getTransactionWithId = require('./get-transaction-by-id');
const getTransactions = require('./get-transactions');

module.exports = {
  getBranchWithId,
  getCustomerWithId,
  getShopWithId,
  getBranches,
  getCustomers,
  getBooks,
  getAppointments,
  getTransactionWithId,
  getTransactions,
  getDashboardData,
};
