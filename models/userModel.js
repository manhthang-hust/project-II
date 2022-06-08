const mongoose = require('mongoose'); 
const validator = require('validator');
const date = require('date-and-time');

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
    data: Object,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const User = mongoose.model('User', userSchema);
module.exports = User;