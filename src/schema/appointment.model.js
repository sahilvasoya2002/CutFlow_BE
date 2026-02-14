const mongoose = require('mongoose');

const { Schema } = mongoose;
const enums = require('../enum');

const AppointmentSchema = new Schema({
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  discountKind: {
    type: String,
    enum: ['FLAT', 'PERCENTAGE'],
    required: true,
    default: 'FLAT',
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  appointmentAt: {
    type: Date,
    default: Date.now,
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: String,
    required: false,
    default: null,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  isBranchDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: enums.PaymentStatus,
    required: true,
    default: 'PENDING',
  },
  paymentVia: {
    type: String,
    enum: enums.PaymentMethod,
    required: true,
    default: 'CASH',
  },
  status: {
    type: String,
    enum: enums.AppointmentStatus,
    required: true,
    default: 'PENDING',
  },
}, {
  timestamps: true,
  id: true,
  autoIndex: true,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema, 'appointments');

module.exports = Appointment;
