const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const Book = require('../models/bookModel');

/* UPLOAD IMAGE & PROCESS IMAGE */
// Upload book image
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

exports.uploadBookImage = upload.single('image');

// resize image to square
exports.resizeBookImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.image = `book-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1333, 2000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/books/${req.body.image}`);

  next();
});

/* REMOVE USER FROM REGISTER_USER */
exports.removeRegisterUser = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) return next(new AppError('No book found with that Id', 404));

  if (!book.registerUsers.includes(req.user._id))
    return next(new AppError('User has not registered this book!', 400));

  book.registerUsers = book.registerUsers.filter((el) => {
    return String(el) !== String(req.user._id);
  });

  await book.save();

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

// ADD USER TO REGISTER_USERS
exports.addRegisterUser = catchAsync(async (req, res, next) => {
  const book = await Book.findById({ _id: req.params.bookId });
  if (!book) return next(new AppError('No book found with that Id', 404));

  if (book.registerUsers.includes(req.user._id))
    return next(new AppError('User has already registered this book!', 400));

  const updatedBook = await Book.findOneAndUpdate(
    {
      _id: req.params.bookId,
    },
    {
      $push: { registerUsers: req.user._id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      book: updatedBook,
    },
  });
});

/**
 * CRUD
 */
exports.getAllBooks = catchAsync(async (req, res, next) => {
  // filter books by categoryID
  let filter = {};

  if (req.params.categoryId) filter = { category: req.params.categoryId };

  let filterByCard = {};
  if (req.user.readingCard.type === 'normal')
    filterByCard = { isVIP: { $ne: true } };

  const apiFeatures = new APIFeatures(
    Book.find(filter).find(filterByCard),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const books = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    result: books.length,
    data: {
      books,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  // Create book on category
  if (req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }

  // If not -> create with category id in the body
  const newBook = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate('bookCopies');

  if (!book) return next(new AppError('No Book found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook)
    return next(new AppError('No Book found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book: updatedBook,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);

  if (!deletedBook)
    return next(new AppError('No Book found with that ID!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
