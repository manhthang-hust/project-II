const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const date = require('date-and-time');

const Event = require('./eventModel');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name!'],
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (val) {
          return validator.isMobilePhone(val, 'vi-VN');
        },
        message: '{VALUE} is not a valid Vietnam phone number',
      },
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email!'],
      validate: [validator.isEmail, 'Please provide a valid email!'],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    ordersQuantity: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password!'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      minlength: 8,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
    birthday: {
      type: Date,
      required: [true, 'Please provide your date of birth'],
    },
    gender: {
      type: String,
      required: [true, 'Please provide your gender'],
      enum: {
        values: ['male', 'female', 'undefined'],
        message: 'Gender is either: male, female, undefined',
      },
    },
    address: {
      type: String,
      required: [true, 'Please provide your address!'],
    },
    readingCard: {
      type: {
        type: String,
        enum: ['normal', 'vip'],
        required: [true, 'Please choose your type of Reading card!'],
      },
      registerDate: {
        type: Date,
        default: new Date(Date.now()),
      },
      expireDate: Date,
      price: Number,
    },
    paymentType: {
      type: String,
      enum: ['month', 'year'],
      required: [true, 'Please choose your payment type!'],
    },
    renewals: [
      {
        renewalDate: Date,
        pay: Number,
      },
    ],
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      default: 'active',
      enum: {
        values: ['active', 'inactive', 'blocked'],
        message: 'User status is either: active, inactive, blocked!',
      },
    },
    statusChangedAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    warningLevel: {
      type: Number,
      default: 0,
      min: [0, 'Warning level is more than or equal 0'],
      max: [3, 'Warning level is more than or equal 3'],
    },
    warningLevelChangedAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    notification: [
      {
        message: {
          type: String,
          required: [true, 'A notification must have a message'],
        },
        createdAt: {
          type: Date,
          default: new Date(Date.now()),
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        order: mongoose.Schema.ObjectId,
        warn: Boolean,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL POPULATE: orders
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
});

/**
 * INSTANCE METHOD: CHECK ORDER DATE EXPIRES
 * (get orders that have book expires)
 */
// PREVENT DUPLICATE MESSAGE ON AN ORDER
// @param: order contains book that is expired
userSchema.methods.checkDuplicateMessage = async function (order, warn) {
  let user;
  if (warn) {
    user = await this.constructor.findOne({
      notification: { $elemMatch: { order: order, warn: true } },
    });
  } else {
    user = await this.constructor.findOne({
      notification: { $elemMatch: { order: order, warn: false } },
    });
  }

  if (!user) return false; // user hasn't received this message before

  return true; // user has received before -> not send again
};

// after 45/60 days
userSchema.methods.checkUserNotReturnBook = function (user) {
  const orders = [];

  for (let i = 0; i < user.orders.length; i += 1) {
    const el = user.orders[i];

    if (el.isReturned === false) {
      const dayDiff = (Date.now() - el.createdAt) / (1000 * 60 * 60 * 24);

      if (user.readingCard.type === 'normal' && dayDiff >= 45 && dayDiff < 50) {
        orders.push(el._id);
      }
      if (user.readingCard.type === 'vip' && dayDiff >= 60 && dayDiff < 65) {
        orders.push(el._id);
      }
    }
  }

  return orders;
};

// in the next 5 days
userSchema.methods.checkUserNotReturnBookInNext5Days = function (user) {
  const orders = [];

  for (let i = 0; i < user.orders.length; i += 1) {
    const el = user.orders[i];

    if (el.isReturned === false) {
      const dayDiff = (Date.now() - el.createdAt) / (1000 * 60 * 60 * 24);

      if (user.readingCard.type === 'normal' && dayDiff >= 50 && dayDiff < 75) {
        orders.push(el._id);
      }
      if (user.readingCard.type === 'vip' && dayDiff >= 65 && dayDiff < 90) {
        orders.push(el._id);
      }
    }
  }

  return orders; // no book expires
};

// in the next 30 days
userSchema.methods.checkUserNotReturnBookInNext30Days = function (user) {
  const orders = [];

  for (let i = 0; i < user.orders.length; i += 1) {
    const el = user.orders[i];

    if (el.isReturned === false) {
      const dayDiff = (Date.now() - el.createdAt) / (1000 * 60 * 60 * 24);

      if (user.readingCard.type === 'normal' && dayDiff >= 75) {
        orders.push(el._id);
      }
      if (user.readingCard.type === 'vip' && dayDiff >= 90) {
        orders.push(el._id);
      }
    }
  }

  return orders;
};

/**
 * DOCUMENT MIDDLEWARE
 */
// ENCRYPT PASSWORD BEFORE SAVING TO DB
userSchema.pre('save', async function (next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;

  next();
});

// UPDATE STATUS_CHANGED_AT && WARNING_LEVEL_CHANGED_AT PROPERTY
userSchema.pre('save', async function (next) {
  if (this.isModified('status')) this.statusChangedAt = Date.now();
  if (this.isModified('warningLevel')) this.warningLevelChangedAt = Date.now();

  next();
});

// SET READING CARD PRICE VS INITIAL REVENUE VS EXPIRE DATE
// ONLY RUN IF USER SIGN UP NEW ACCOUNT
userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  // price
  this.price = await this.updatePrice(this);

  // add new renewal to renewals
  const renewal = {};
  if (this.paymentType === 'month') renewal.pay = this.price;
  else if (this.paymentType === 'year') renewal.pay = this.price * 10;
  renewal.renewalDate = Date.now();
  this.renewals.push(renewal);

  // update expire date of reading card
  this.readingCard.expireDate =
    this.paymentType === 'month'
      ? date.addMonths(new Date(Date.now()), 1)
      : date.addYears(new Date(Date.now()), 1);

  next();
});

// INSTANCE METHOD: Check password to login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CHECK PASSWORD IS CHANGED AFTER THE TOKEN IS ISSUED
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
    return changedTimestamp > JWTTimestamp;
  }

  return false; // Not changed
};

// GENERATE RANDOM TOKEN
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires after 10m

  return resetToken;
};

// UPDATE PASSWORD_CHANGED_AT
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

/* INSTANCE METHOD */
// UPDATE PRICE DEPENDING ON EVENT
userSchema.methods.updatePrice = async function (user) {
  // Check this time has any event occurs
  const events = await Event.aggregate([
    {
      $match: {
        startDate: { $lte: new Date(Date.now()) },
        endDate: { $gte: new Date(Date.now()) },
      },
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          gender: '$gender',
          minAge: '$minAge',
          maxAge: '$maxAge',
          discount: '$discount',
        },
      },
    },
    {
      $addFields: {
        gender: '$_id.gender',
        minAge: '$_id.minAge',
        maxAge: '$_id.maxAge',
        discount: '$_id.discount',
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { discount: -1 },
    },
  ]);

  // If yes, decrease reading card price for vip & normal user
  const initialPrice =
    this.readingCard.type === 'vip'
      ? process.env.CARD_VIP_PRICE
      : process.env.CARD_NORMAL_PRICE;

  if (events.length > 0 && events[0].gender !== 'all') {
    if (
      user.gender === events[0].gender &&
      user.birthday >= new Date(events[0].minAge) &&
      user.birthday <= new Date(events[0].maxAge)
    ) {
      user.readingCard.price = (1 - events[0].discount) * initialPrice;
    } else {
      user.readingCard.price = initialPrice;
    }
  } else if (events.length > 0 && events[0].gender === 'all') {
    if (
      user.birthday >= new Date(events[0].minAge) &&
      user.birthday <= new Date(events[0].maxAge)
    ) {
      user.readingCard.price = (1 - events[0].discount) * initialPrice;
    } else {
      user.readingCard.price = initialPrice;
    }
  } else if (events.length === 0) {
    user.readingCard.price = initialPrice;
  }

  return user.readingCard.price;
};

// UPDATE PRICE AFTER CREATING NEW EVENT
userSchema.methods.updatePriceAfterCreatingEvent = async function (event) {
  // for vip users
  await this.constructor.updateMany(
    {
      'readingCard.type': 'vip',
      birthday: {
        $gte: new Date(event.minAge),
        $lte: new Date(event.maxAge),
      },
    },
    {
      'readingCard.price': (1 - event.discount) * process.env.CARD_VIP_PRICE,
    }
  );

  // for normal users
  await this.constructor.updateMany(
    {
      'readingCard.type': 'normal',
      birthday: {
        $gte: new Date(event.minAge),
        $lte: new Date(event.maxAge),
      },
    },
    {
      'readingCard.price': (1 - event.discount) * process.env.CARD_NORMAL_PRICE,
    }
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
