const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  bookNumber: {
    type: String,
    required: true,
  },
  dueAmount: {
    type: Number,
    required: true,
    default: 0,
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
  customers: [
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

const Book = mongoose.model('Book', BookSchema, 'books');

module.exports = Book;
