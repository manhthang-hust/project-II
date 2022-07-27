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

// UPDATE BOOK_COPY NAME DEPEND ON BOOK BEFORE SAVING
bookCopySchema.pre('save', async function (next) {
  // find the book
  const book = await Book.findById(this.book);

  // set the name to book copy
  this.name = book.name;

  next();
});

// UPDATE BOOK_COPY NAME WHEN UPDATING A BOOK

/**
 * QUERY MIDDLEWARE
 */
/* POPULATE BOOK BEFORE QUERY BOOK_COPY */
bookCopySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'book',
    select: 'name image status',
  });

  next();
});

/**
 * DOCUMENT MIDDLEWARE
 */
/* UPDATE FIELD isVip, name, slug for bookCopy before save
  This field is equal to book
*/
bookCopySchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const book = await Book.findOne({ _id: this.book });
  if (book.isVIP) this.isVIP = true;
  this.name = book.name;
  this.slug = book.slug;

  next();
});

/* 
  SEND NOTIFICATION FOR REGISTER USER
*/
bookCopySchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  // Find the book from ID
  const book = await Book.findById(this.book);

  // Find all users register
  const users = await User.find({ _id: { $in: book.registerUsers } });
  if (!users) return next();

  // Add notification
  const newNotification = {};
  newNotification.message = `Sách ${this.name} mới được nhập về!`;
  newNotification.createdAt = Date.now();
  users.forEach(async (user) => {
    user.notification.push(newNotification);
    await user.save({ validateBeforeSave: false });
  });

  next();
});

/**
 * UPDATE *QUANTITY* OF BOOK AFTER CREATING AN BOOK_COPY
 */
// CALCULATE NUMBER OF BOOK_COPY THAT IS NOT LOST
bookCopySchema.statics.calcNumBookCopies = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId, status: { $ne: 'isLost' } },
    },
    {
      $group: {
        _id: '$book',
        numBookCopies: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) {
    await Book.findByIdAndUpdate(bookId, {
      quantity: 0,
    });
  } else
    await Book.findByIdAndUpdate(bookId, {
      quantity: stats[0].numBookCopies,
    });
};

// UPDATE QUANTITY OF BOOK AFTER CREATING A BOOK_COPY
bookCopySchema.post('save', function () {
  this.constructor.calcNumBookCopies(this.book._id);
});

// UPDATE QUANTITY OF BOOK AFTER DELETING/UPDATING BOOK_COPY
bookCopySchema.pre(/^findOneAnd/, async function (next) {
  this.bc = await this.findOne();
  next();
});
bookCopySchema.post(/^findOneAnd/, function () {
  this.bc.constructor.calcNumBookCopies(this.bc.book._id);
});

/**
 * UPDATE *AVAILABLE* OF BOOK AFTER CREATING AN BOOK_COPY
 */
// CALCULATE NUMBER OF BOOK_COPY THAT IS AVAILABLE
bookCopySchema.statics.calcNumBookCopiesAvail = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId, status: 'available' },
    },
    {
      $group: {
        _id: '$book',
        numBookCopies: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) {
    await Book.findByIdAndUpdate(bookId, {
      available: 0,
    });
  } else
    await Book.findByIdAndUpdate(bookId, {
      available: stats[0].numBookCopies,
    });
};

// UPDATE QUANTITY OF BOOK AFTER CREATING A BOOK_COPY
bookCopySchema.post('save', function () {
  this.constructor.calcNumBookCopiesAvail(this.book._id);
});

// UPDATE QUANTITY OF BOOK AFTER DELETING/UPDATING BOOK_COPY
bookCopySchema.pre(/^findOneAnd/, async function (next) {
  this.bcAvail = await this.findOne();
  next();
});
bookCopySchema.post(/^findOneAnd/, function () {
  this.bcAvail.constructor.calcNumBookCopies(this.bc.book._id);
});

const BookCopy = mongoose.model('BookCopy', bookCopySchema);
module.exports = BookCopy;
