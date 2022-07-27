const express = require('express');

const bookCopyController = require('../controllers/bookCopyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

/* RETURN BOOK COPY */
router.patch(
  '/returned-bookCopy',
  authController.restrictTo('admin'),
  bookCopyController.updateReturnBook
);

/* STATS */
router.get(
  '/book-stats',
  authController.restrictTo('admin'),
  bookCopyController.getBookCopyStats
);
router.get('/top-5-books', bookCopyController.getTop5Books);

// CRUD
router
  .route('/')
  .get(bookCopyController.getAllBookCopies)
  .post(authController.restrictTo('admin'), bookCopyController.createBookCopy);
router
  .route('/:id')
  .get(bookCopyController.getBookCopy)
  .patch(authController.restrictTo('admin'), bookCopyController.updateBookCopy)
  .delete(
    authController.restrictTo('admin'),
    bookCopyController.deleteBookCopy
  );

module.exports = router;
