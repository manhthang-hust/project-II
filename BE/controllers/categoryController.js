const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Category = require('../models/categoryModel');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    result: categories.length,
    data: {
      categories,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('books');

  if (!Category) return next(new AppError('No Category found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!updatedCategory) return next(new AppError('No Category found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      category: updatedCategory,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const deletedCategory = await Category.findByIdAndDelete(req.params.id);

  if (!deletedCategory) return next(new AppError('No Category found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
