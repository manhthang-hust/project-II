const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/today-orders', orderController.getTodayOrders);

//CRUD
router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrderOff); // for Admin
router
  .route('/:id')
  .get(orderController.getOrder)
  .post(orderController.createOrder) // for User
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
