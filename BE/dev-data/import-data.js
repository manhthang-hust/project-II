const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

const Book = require('../models/bookModel');
const BookCopy = require('../models/bookCopyModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Event = require('../models/eventModel');
const Order = require('../models/orderModel');

dotenv.config({ path: './config.env' });

// CONNECT TO DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successfully!'));

// Read data
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8')
);
const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const bookCopies = JSON.parse(
  fs.readFileSync(`${__dirname}/bookCopies.json`, 'utf-8')
);

// IMPORT DATA
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    // await Category.create(categories);
    // await Book.create(books);
    // await BookCopy.create(bookCopies);
    console.log('Import Data successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA
const deleteData = async () => {
  try {
    // await Book.deleteMany();
    // await BookCopy.deleteMany();
    await User.deleteMany();
    // await Order.deleteMany();
    // await Category.deleteMany();
    // await Event.deleteMany();
    console.log('Delete Data successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node dev-data\import-data.js
