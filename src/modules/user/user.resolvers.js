
const { models } = require('mongoose');

const {
  signupUser,
  login,
  createShop,
  updateShop,
  createCustomer,
  removeCustomer,
  updateBranch,
  updateCustomer,
  createAppointment,
  makeAppointmentPayment,
  clearDueCustomerAmount,
} = require('./mutation');

const {
  getBranchWithId,
  getShopWithId,
  getCustomerWithId,
  getBranches,
  getCustomers,
  getBooks,
  getAppointments,
  getTransactions,
  getTransactionWithId,
  getDashboardData,
} = require('./query');

const resolver = {
  Query: {
    helloWorld: () => 'Hello, World!',
    getBranchWithId,
    getShopWithId,
    getCustomerWithId,
    getBranches,
    getCustomers,
    getBooks,
    getAppointments,
    getTransactions,
    getTransactionWithId,
    getDashboardData,
  },
  Mutation: {
    signupUser,
    login,
    createShop,
    updateShop,
    createCustomer,
    removeCustomer,
    updateBranch,
    updateCustomer,
    createAppointment,
    makeAppointmentPayment,
    clearDueCustomerAmount,
  },
  Shop: {
    branches: async parent => {
      const { Branch: BranchModel } = models;

      if (!parent.branches || parent.branches.length === 0) {
        return [];
      }

      return BranchModel.find({
        _id: { $in: parent.branches },
      });
    },
  },
  Customer: {
    familyMembers: async parent => {
      const { Customer: CustomerModel } = models;
      if (!parent.familyMembers || parent.familyMembers.length === 0) {
        return [];
      }
      return CustomerModel.find({
        _id: { $in: parent.familyMembers },
      });
    },
  },
  Book: {
    customers: async parent => {
      const { Customer: CustomerModel } = models;
      if (!parent.customers || parent.customers.length === 0) {
        return [];
      }
      return CustomerModel.find({
        _id: { $in: parent.customers },
      });
    },
  },
};

module.exports = resolver;
