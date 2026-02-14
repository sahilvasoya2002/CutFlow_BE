const mongoose = require('mongoose');

const { Schema } = mongoose;

const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  openingTime: {
    type: String,
    required: false,
  },
  closingTime: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
  id: true,
  autoIndex: true,
});

const Branch = mongoose.model('Branch', BranchSchema, 'branches');

module.exports = Branch;
