const mongoose = require('mongoose');

const Book = require('./bookModel');
const User = require('./userModel');

const bookCopySchema = new mongoose.Schema({
  copyId: {
    type: String,
    unique: [true, 'Copy ID must be unique!'],
    trim: true,
    required: [true, 'Please enter Copy ID!'],
  },
  name: String,
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'A book copy must be belong to a book!'],
  },
  new: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: {
      values: ['unavailable', 'isLost', 'available'],
      message: 'status of bookCopy is either: unavailable, available, isLost!',
    },
    default: 'available',
  },
  statusChangedAt: Date,
  printedYear: {
    type: Number,
    required: [true, 'You should provide printed year!'],
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  isVIP: {
    type: Boolean,
    default: false,
  },
  ordersQuantity: {
    type: Number,
    default: 0,
  },
});


const BookCopy = mongoose.model('BookCopy', bookCopySchema);
module.exports = BookCopy;