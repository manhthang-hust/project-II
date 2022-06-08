const mongoose = require('mongoose');
const Category = require('./categoryModel');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name!'],
      trim: true,
      unique: true,
    },
    slug: String,
    image: {
      type: String,
      required: [true, 'A book must have an image!'],
    },
    publisher: {
      type: String,
      required: [true, 'A book must have a publisher'],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      default: 0,
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    description: String,
    registerUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A book must have belong to a category!'],
    },
    author: {
      type: String,
      required: [true, 'A book must have an author!'],
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
