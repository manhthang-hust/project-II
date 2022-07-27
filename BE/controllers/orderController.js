const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const Order = require('../models/orderModel');
const User = require('../models/userModel');
const BookCopy = require('../models/bookCopyModel');

/**
 * CREATE NEW OFFLINE ORDER FOR ADMIN
 */
exports.createOrderOff = catchAsync(async (req, res, next) => {
  // Check user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('No user found with that Email', 404));

  // Check if bookCopy exists
  const bookCopy = await BookCopy.findOne({ copyId: req.body.copyId });
  if (!bookCopy)
    return next(new AppError('No bookCopy found with that copy Id', 404));

  // Check if this bookCopy is borrowed
  if (bookCopy.status !== 'available')
    return next(
      new AppError(
        'This book is not available. Please choose another books!',
        401
      )
    );

  // Update status of bookCopy
  bookCopy.status = 'unavailable';
  await bookCopy.save();

  // Check if user is inactivated or blocked
  if (user.status === 'inactive' || user.status === 'blocked')
    return next(new AppError(`This user is ${user.status}!`, 401));

  // Normal users can not order more than 5 books (8 books for VIP one)
  if (user.ordersQuantity === 5 && user.readingCard.type === 'normal')
    return next(
      new AppError(
        'Normal user can only book maximum 5 books! Please return some books to continue ordering!',
        401
      )
    );
  if (user.ordersQuantity === 8 && user.readingCard.type === 'vip')
    return next(
      new AppError(
        'Vip user can only book maximum 8 books! Please return some books to continue ordering!',
        401
      )
    );

  // Create new Order from body
  const newOrder = await Order.create({
    user: user._id,
    bookCopy: bookCopy._id,
    online: false,
  });

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

/*
  GET ALL ORDERS ON THE CURRENT DAY
*/
exports.getTodayOrders = catchAsync(async (req, res, next) => {
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999));

  const todayOrders = await Order.aggregate([
    {
      $match: {
        online: true,
        createdAt: { $lte: endOfDay, $gte: startOfDay },
      },
    },
    {
      $lookup: {
        from: 'bookcopies',
        localField: 'bookCopy',
        foreignField: '_id',
        as: 'bookCopy',
      },
    },
    {
      $unwind: '$bookCopy',
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        'bookCopy.name': 1,
        'bookCopy.printedYear': 1,
        'bookCopy.copyId': 1,
        receiverName: 1,
        receiverAddress: 1,
        receiverPhone: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: todayOrders.length,
    data: {
      todayOrders,
    },
  });
});

/* CRUD */
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    result: orders.length,
    data: {
      orders,
    },
  });
});

// Create new Online Order for Current User
exports.createOrder = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.bookCopy = req.params.id;

  // Check user is inactive
  const user = await User.findById(req.user._id);
  if (user.status === 'inactive')
    return next(
      new AppError('You are inactivated. Contact us for more supports!', 401)
    );

  // Check book is available
  const bookCopy = await BookCopy.findById(req.params.id);
  if (bookCopy.status !== 'available')
    return next(
      new AppError(
        'This book is not available. Please order another book!',
        400
      )
    );

  // Normal users can not order more than 5 books (8 books for VIP one)
  if (user.ordersQuantity === 5 && user.readingCard.type === 'normal')
    return next(
      new AppError(
        'Normal user can only book maximum 5 books! Please return some books to continue ordering!',
        401
      )
    );
  if (user.ordersQuantity === 8 && user.readingCard.type === 'vip')
    return next(
      new AppError(
        'Vip user can only book maximum 8 books! Please return some books to continue ordering!',
        401
      )
    );

  const newOrder = await Order.create(req.body);
  bookCopy.status = 'unavailable';
  await bookCopy.save();

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!Order) return next(new AppError('No Order found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body);

  if (!updatedOrder) return next(new AppError('No Order found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) return next(new AppError('No Order found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
