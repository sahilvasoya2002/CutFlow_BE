const mongoose = require('mongoose');

const enums = require('../enum');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: enums.Sex,
    required: true,
  },
  avatar: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: true,
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
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  id: true,
  autoIndex: true,
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
