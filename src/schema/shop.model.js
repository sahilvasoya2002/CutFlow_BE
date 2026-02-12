const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
  ],
  noOfBranches: {
    type: Number,
    required: true,
    default: 0,
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

const Shop = mongoose.model('Shop', ShopSchema, 'shops');

module.exports = Shop;
