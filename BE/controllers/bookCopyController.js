const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const BookCopy = require('../models/bookCopyModel');
const Order = require('../models/orderModel');

/**
 * RETURN BOOK COPY
 * - input: copyID of bookCopy
 */
exports.updateReturnBook = catchAsync(async (req, res, next) => {
  // Get the CopyID from body (input)
  const { copyId } = req.body;

  // Check if there has a bookCopy belong to this copyID is borrowed
  const bookCopy = await BookCopy.findOne({
    copyId,
  });
  if (!bookCopy)
    return next(
      new AppError('No book copy with that ID is being borrowed!', 404)
    );

  // Check if this book copy is being borrowed
  const order = await Order.findOne({
    bookCopy: bookCopy._id,
    isReturned: false,
  });

  if (!order)
    return next(
      new AppError('No book copy with that ID is being borrowed', 404)
    );

  // Update isReturned & returnDate of order of that book copy
  order.isReturned = true;
  order.returnDate = Date.now();
  order.bookCopy = order.bookCopy._id;
  order.user = order.user._id;
  await order.save();

  // Update status of current bookCopy
  bookCopy.status = 'available';

  await bookCopy.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      bookCopy,
    },
  });
});

/**
 * STATISTICS FOR BOOK Copies
 */
/* Number of different types of Book */
exports.getBookCopyStats = catchAsync(async (req, res, next) => {
  const bookStats = await BookCopy.aggregate([
    {
      $facet: {
        allBooks: [
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        borrowingBooks: [
          {
            $match: { status: 'unavailable' },
          },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        lostBooks: [
          {
            $match: { status: 'isLost' },
          },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        newBooks: [
          {
            $match: { new: true },
          },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        oldBooks: [
          {
            $match: { new: false },
          },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        vipBooks: [
          { $match: { isVIP: true } },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
        normalBooks: [
          { $match: { isVIP: false } },
          {
            $group: {
              _id: null,
              numBooks: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      bookStats,
    },
  });
});

/* 
  TOP 5 BOOKS IN A MONTH
  - classified by the number of orders
*/
exports.getTop5Books = catchAsync(async (req, res, next) => {
  const currentMonth = new Date(Date.now()).getMonth() + 1;

  const topBooks = await BookCopy.aggregate([
    {
      $addFields: { month: { $month: '$createdAt' } },
    },
    {
      $match: { month: currentMonth },
    },
    {
      $group: {
        _id: '$book',
        numOrders: { $sum: '$ordersQuantity' },
      },
    },
    {
      $addFields: { book: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOrders: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'book',
      },
    },
    {
      $unwind: '$book',
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      topBooks,
    },
  });
});

/**
 * CRUD
 */
exports.getAllBookCopies = catchAsync(async (req, res, next) => {
  // Filter book copies by book
  let filter = {};
  if (req.params.bookId) filter = { book: req.params.bookId };

  const apiFeatures = new APIFeatures(BookCopy.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookCopies = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    result: bookCopies.length,
    data: {
      bookCopies,
    },
  });
});

exports.createBookCopy = catchAsync(async (req, res, next) => {
  if (req.params.bookId) req.body.book = req.params.bookId;

  const newBookCopy = await BookCopy.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      bookCopy: newBookCopy,
    },
  });
});

exports.getBookCopy = catchAsync(async (req, res, next) => {
  const bookCopy = await BookCopy.findById(req.params.id);

  if (!bookCopy)
    return next(new AppError('No BookCopy found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      bookCopy,
    },
  });
});

exports.updateBookCopy = catchAsync(async (req, res, next) => {
  const updatedBookCopy = await BookCopy.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBookCopy)
    return next(new AppError('No BookCopy found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      bookCopy: updatedBookCopy,
    },
  });
});

exports.deleteBookCopy = catchAsync(async (req, res, next) => {
  const deletedBookCopy = await BookCopy.findByIdAndDelete(req.params.id);

  if (!deletedBookCopy)
    return next(new AppError('No BookCopy found with that ID!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
