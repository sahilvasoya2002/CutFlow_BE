
const Appointment = require('./appointment.model');
const Book = require('./book.model');
const Branch = require('./branch.model');
const Customer = require('./customer.model');
const Shop = require('./shop.model');
const Transaction = require('./transaction.model');
const User = require('./user.model');

const models = {
  User,
  Shop,
  Branch,
  Customer,
  Book,
  Appointment,
  Transaction,
};

module.exports = models;
