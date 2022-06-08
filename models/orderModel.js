const mongoose = require('mongoose');
const validator = require('validator');

const BookCopy = require('./bookCopyModel');
const User = require('./userModel');

const orderSchema = new mongoose.Schema({
  bookCopy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BookCopy',
    required: [true, 'An Order must have a bookCopy!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An order must have an User'],
  },
  receiverName: String,
  receiverAddress: String,
  receiverPhone: {
    type: String,
    required: false,
    validate: {
      validator: function (val) {
        return validator.isMobilePhone(val, 'vi-VN');
      },
      message: '{VALUE} is not a valid Vietnam phone number',
    },
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  returnDate: {
    type: Date,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  online: {
    type: Boolean,
    default: true,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
