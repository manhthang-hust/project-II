const express = require('express');

const bookCopyRouter = require('./bookCopyRoutes');

const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

/* NESTED ROUTE */
// Route for get book copies by book
router.use('/:bookId/bookCopies', bookCopyRouter);

/* NOTIFICATION
  - method PATCH: User turns on notification
  - method DELETE: User turns off notification
*/
router
  .route('/:bookId/notification')
  .patch(bookController.addRegisterUser)
  .delete(bookController.removeRegisterUser);

// CRUD
router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.restrictTo('admin'),
    bookController.uploadBookImage,
    bookController.resizeBookImage,
    bookController.createBook
  );
router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    authController.restrictTo('admin'),

    bookController.uploadBookImage,
    bookController.resizeBookImage,
    bookController.updateBook
  )
  .delete(authController.restrictTo('admin'), bookController.deleteBook);

module.exports = router;
