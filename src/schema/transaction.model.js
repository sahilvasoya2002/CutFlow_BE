const mongoose = require('mongoose');

const { Schema } = mongoose;
const enums = require('../enum');

const transactionSchema = new Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    cashAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    upiAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    appointmentAt: {
      type: Date,
      default: null,
    },
    isDuePayment: {
      type: Boolean,
      default: false,
    },
    paymentVia: {
      type: String,
      enum: enums.paymentVia,
      required: true,
    },
    isReverted: {
      type: Boolean,
      default: false,
    },
    isBranchDeleted: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    id: true,
    autoIndex: true,
  },
);

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions');
