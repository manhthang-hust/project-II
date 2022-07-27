const multer = require('multer');
const sharp = require('sharp');
const date = require('date-and-time');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeature = require('../utils/apiFeatures');

const User = require('../models/userModel');
const Order = require('../models/orderModel');

/**
 * RENEWAL READING FOR CURRENT USER
 * * By Month: price
 * * By Year: price x 10
 */
exports.renewReadingCard = catchAsync(async (req, res, next) => {
  // 1) Get current user
  const user = await User.findById(req.user.id);

  // 2) Get & update the paymentType user choose (month or year)
  const type = req.body.paymentType;
  user.paymentType = type;

  // 3) Get price of reading card of current user
  const price = await user.updatePrice(user);

  // 4) Update and save the renewals of current user (push new renewal to renewals[])
  const renewal = {};
  if (type === 'month') renewal.pay = price;
  else if (type === 'year') renewal.pay = price * 10;
  renewal.renewalDate = Date.now();
  user.renewals.push(renewal);

  // update the expire date of reading card
  const currentExpireDate =
    new Date(Date.now()) > user.readingCard.expireDate
      ? new Date(Date.now())
      : user.readingCard.expireDate;

  user.readingCard.expireDate =
    user.paymentType === 'month'
      ? date.addMonths(currentExpireDate, 1)
      : date.addYears(currentExpireDate, 1);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

/**
 * GET CURRENT USER'S ORDERS
 */
exports.getMyOrders = catchAsync(async (req, res, next) => {
  // Find all orders
  const orders = await Order.find({ user: req.user._id }).select(
    'isReturned createdAt returnDate -user'
  );

  // Find orders with returned IDs
  /* const bookCopyIDs = orders.map((el) => el.bookCopy);
  const bookCopies = await BookCopy.find({
    _id: { $in: bookCopyIDs },
  }).populate({
    path: 'book',
    select: 'name image',
  }); */

  res.status(200).json({
    status: 'success',
    result: orders.length,
    data: {
      orders,
    },
  });
});

/* UPLOAD IMAGE & PROCESS IMAGE */
// Upload user photo
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only image!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// resize image to square
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // for updateMe route
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

/**
 * USER'S INFORMATION:
 *** GET my information
 *** UPDATE my information
 *** GET HISTORY OF ORDERING BOOKS
 - (Note that user has logged in)
 */
/* GET MY INFORMATION */
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/* UPDATE MY INFORMATION */
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Error if user POSTs Password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'You are not allowed to change password here! Please use route: /updateMyPassword instead.',
        400
      )
    );

  // 2) If users upload photo
  if (req.file) req.body.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  // Send data to client
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

/* DELETE MY ACCOUNT (set status -> 'inactive') */
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: 'inactive' });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * NOTIFICATION
 */
/* OUTPUT: message
   -> order by -createdAt
*/
exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const messages = req.user.notification.sort(function (a, b) {
    if (a.createdAt > b.createdAt) return -1;
    return 1;
  });

  // Update all notifications to be read
  await User.updateOne(
    { _id: req.user._id },
    { 'notification.$[].isRead': true }
  );

  res.status(200).json({
    status: 'success',
    result: messages.length,
    data: {
      notifications: messages,
    },
  });
});

/**
 * STATISTICS FOR USERS DATA
 */
/* OUTPUT:
  num of normal/VIP, warningLevel 1/2/3, blocked Users
  group by 12 months in a year
*/
exports.GetMonthlyUserStats = catchAsync(async (req, res, next) => {
  if (!req.params.year) return next(new AppError('Please choose a year!', 400));

  const year = req.params.year * 1;

  const stats = await User.aggregate([
    {
      $facet: {
        newUserByCardType: [
          {
            $match: {
              'readingCard.registerDate': {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$readingCard.registerDate' },
                cardType: '$readingCard.type',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.month',
              detail: {
                $push: {
                  readingCard: '$_id.cardType',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { month: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
        byWarningLevel: [
          {
            $match: {
              warningLevelChangedAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$warningLevelChangedAt' },
                warningLevel: '$warningLevel',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.month',
              detail: {
                $push: {
                  level: '$_id.warningLevel',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { month: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
        byStatus: [
          {
            $match: {
              statusChangedAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$statusChangedAt' },
                status: '$status',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.month',
              detail: {
                $push: {
                  status: '$_id.status',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { month: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0],
    },
  });
});

/* OUTPUT:
  num of normal/VIP, warningLevel 1/2/3, blocked Users
  group by days in a months in a year
*/
exports.getDailyUserStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const month = req.params.month * 1;

  const stats = await User.aggregate([
    {
      $facet: {
        newUserByCardType: [
          {
            $match: {
              'readingCard.registerDate': {
                $gte: new Date(`${year}-${month}-01`),
                $lte: new Date(`${year}-${month}-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: '$readingCard.registerDate' },
                cardType: '$readingCard.type',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.day',
              detail: {
                $push: {
                  readingCard: '$_id.cardType',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { day: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
        byWarningLevel: [
          {
            $match: {
              warningLevelChangedAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: '$warningLevelChangedAt' },
                warningLevel: '$warningLevel',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.day',
              detail: {
                $push: {
                  level: '$_id.warningLevel',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { day: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
        byStatus: [
          {
            $match: {
              statusChangedAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
              role: { $ne: 'admin' },
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: '$statusChangedAt' },
                status: '$status',
              },
              numUsers: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.day',
              detail: {
                $push: {
                  status: '$_id.status',
                  count: '$numUsers',
                },
              },
            },
          },
          {
            $addFields: { day: '$_id' },
          },
          {
            $project: { _id: 0 },
          },
          {
            $sort: { month: 1 },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0],
    },
  });
});

/**
 * STATISTICS FOR USERS'S REVENUE
 */
/* OUTPUT:
  group by months in a year
*/
exports.getMonthlyRevenueStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const stats = await User.aggregate([
    {
      $unwind: '$renewals',
    },
    {
      $match: {
        'renewals.renewalDate': {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        role: { $ne: 'admin' },
      },
    },
    {
      $group: {
        _id: { $month: '$renewals.renewalDate' },
        numRevenue: { $sum: '$renewals.pay' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

/* OUTPUT:
  group by days in a months in a year
*/
exports.getDailyRevenueStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const month = req.params.month * 1;

  const stats = await User.aggregate([
    {
      $unwind: '$renewals',
    },
    {
      $match: {
        'renewals.renewalDate': {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`),
        },
        role: { $ne: 'admin' },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$renewals.renewalDate' },
        sumRevenue: { $sum: '$renewals.pay' },
      },
    },
    {
      $addFields: { day: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { day: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

/**
 * GET ALL USERS FROM DATABASE
 * Implemented filter, sort, limit fields, pagination function
 */
exports.getAllUser = async (req, res, next) => {
  const apiFeature = new APIFeature(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await apiFeature.query;

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
};

/**
 * GET USER by ID
 * Need to pass ID in route as a param
 */
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: 'orders',
      select: 'createdAt isReturned -user -bookCopy',
    })
    .select('-renewals');

  if (!user) return next(new AppError('No user found!', 404));

  // Inform user to return back book
  if (user.checkUserNotReturnBook(user).length !== 0) {
    const orders = user.checkUserNotReturnBook(user);

    orders.forEach(async (el) => {
      if (!(await user.checkDuplicateMessage(el, false))) {
        const newNotification = {};
        const message = `You have borrowed a book in ${
          user.readingCard.type === 'vip' ? '60' : '45'
        } days. Please return book in next 5 days. Otherwise, your warning level will be increased! `;

        newNotification.message = message;
        newNotification.order = el;
        newNotification.warn = false;

        user.notification.push(newNotification);
        await user.save({ validateBeforeSave: false });
      }
    });
  }

  // Increase warning level after next 5 days not return book
  if (
    user.warningLevel < 3 &&
    user.checkUserNotReturnBookInNext5Days(user).length !== 0
  ) {
    const orders = user.checkUserNotReturnBookInNext5Days(user);

    orders.forEach(async (el) => {
      if (!(await user.checkDuplicateMessage(el, true))) {
        // Increase warning level
        user.warningLevel += 1;

        // inform to user
        const newNotification = {};

        newNotification.message = `You have borrowed a book in ${
          user.readingCard.type === 'vip' ? '65' : '50'
        } days. So your warning level is up to ${user.warningLevel}`;
        newNotification.order = el;
        newNotification.warn = true;

        user.notification.push(newNotification);
        await user.save({ validateBeforeSave: false });
      }
    });
  }

  // warning level == 3 -> block this user
  if (user.warningLevel >= 3) {
    user.status = 'blocked';
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'Your warning level is 3. So your account is blocked permanently!',
        403
      )
    );
  }

  // Not return book after 30 days expire -> block permanently
  if (user.checkUserNotReturnBookInNext30Days(user).length !== 0) {
    user.status = 'blocked';
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'Your account is blocked permanently because of not returning back book on time within 30 days!',
        403
      )
    );
  }

  // If reading card is expired -> inactivate this user
  if (
    new Date(Date.now()) > user.readingCard.expireDate &&
    user.status === 'active'
  ) {
    user.status = 'inactive';
    await user.save({ validateBeforeSave: false });
  }
  if (
    new Date(Date.now()) <= user.readingCard.expireDate &&
    user.status === 'inactive'
  ) {
    user.status = 'active';
    await user.save({ validateBeforeSave: false });
  }

  // Count the unread notifications
  let count = 0;
  user.notification.forEach((el) => {
    if (el.isRead === false) {
      count += 1;
    }
  });

  // Remove notification & orders from output (not populate the output)
  user.orders = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      numUnreadNotifications: count,
      user,
    },
  });
});

/**
 * UPDATE USER BY ID
 * Need to pass ID in route as a param
 * This route is for ADMIN, NOT for USER (updateMe)
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedUser) return next(new AppError('No user found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) return next(new AppError('No user found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
