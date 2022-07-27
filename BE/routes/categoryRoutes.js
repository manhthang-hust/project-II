const express = require('express');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const bookRouter = require('./bookRoutes');

const router = express.Router();

router.use(authController.protect);

// NESTED ROUTE: Get all books on a category
router.use('/:categoryId/books', bookRouter);

//CRUD
router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);
router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
