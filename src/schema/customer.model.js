const mongoose = require('mongoose');

const enums = require('../enum');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: enums.Sex,
    required: true,
  },
  address: {
    type: String,
    required: false,
    default: null,
  },
  dueAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  bookNumber: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: false,
    default: null,
  },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: null,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  familyMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false,
      default: [],
    },
  ],
}, {
  timestamps: true,
  id: true,
  autoIndex: true,
});

const Customer = mongoose.model('Customer', CustomerSchema, 'customers');

module.exports = Customer;
