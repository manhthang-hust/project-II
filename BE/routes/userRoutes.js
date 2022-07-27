const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

// REVENUE READING CARD
router.patch('/renewalReadingCard', userController.renewReadingCard);

// MY ORDERS
router.get('/my-orders', userController.getMyOrders);

/* STATS */
// About User Data
router.get(
  '/monthly-user-stats/:year',
  authController.restrictTo('admin'),
  userController.GetMonthlyUserStats
);
router.get(
  '/daily-user-stats/:year/:month',
  authController.restrictTo('admin'),
  userController.getDailyUserStats
);

// About User Revenue
router.get(
  '/monthly-revenue-stats/:year',
  authController.restrictTo('admin'),
  userController.getMonthlyRevenueStats
);
router.get(
  '/daily-revenue-stats/:year/:month',
  authController.restrictTo('admin'),
  userController.getDailyRevenueStats
);

// GET NOTIFICATIONS
router.get('/notifications', userController.getAllNotifications);

/* MANAGE INFORMATION (FOR USERS) 
  - GET CURRENT USER DATA
  - UPDATE CURRENT USER DATA
  - DELETE (INACTIVATE) CURRENT USER DATA
*/
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
// CRUD
router.route('/').get(userController.getAllUser); // Create new User is Sign up function

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
