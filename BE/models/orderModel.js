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

/**
 * QUERY MIDDLEWARE
 */
/* POPULATE BOOK & USER BEFORE QUERY */
orderSchema.pre(/^find/, function (next) {
  this.find()
    .populate({
      path: 'bookCopy',
      select: '-__v -createdAt -isVIP -printedYear',
    })
    .populate({
      path: 'user',
      select: 'name email phone address',
    });

  next();
});

/**
 * UPDATE *ORDERS_QUANTITY OF BOOK_COPY
 */
/* STATICS METHOD */
// CALCULATE NUM OF ORDERS
orderSchema.statics.calcNumOrders = async function (bookCopyId) {
  const stats = await this.aggregate([
    {
      $match: { bookCopy: bookCopyId },
    },
    {
      $group: {
        _id: '$bookCopy',
        numOrders: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0)
    await BookCopy.findByIdAndUpdate(bookCopyId, {
      ordersQuantity: 0,
    });
  else
    await BookCopy.findByIdAndUpdate(bookCopyId, {
      ordersQuantity: stats[0].numOrders,
    });
};

/* DOCUMENT MIDDLEWARE */
// CALL CALCULATE FUNC AFTER CREATING AN ORDER
orderSchema.post('save', function () {
  this.constructor.calcNumOrders(this.bookCopy._id);
});

/**
 * UPDATE CURRENT ORDERS_QUANTITY
 */
/* 
  STATIC METHOD: CALCULATE NUM OF ORDER THAT IS NOT RETURNED YET
*/
orderSchema.statics.calcNumOrdersUser = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        user: userId,
        isReturned: false,
      },
    },
    {
      $group: {
        _id: '$user',
        numOrders: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0)
    await User.findByIdAndUpdate(userId, {
      ordersQuantity: 0,
    });
  else
    await User.findByIdAndUpdate(userId, {
      ordersQuantity: stats[0].numOrders,
    });
};

// CALL FUNCTION AFTER USER BORROWS OR RETURNS A BOOK
orderSchema.post('save', function () {
  this.constructor.calcNumOrdersUser(this.user);
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
