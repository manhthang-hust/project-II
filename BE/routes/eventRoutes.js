const express = require('express');

const eventController = require('../controllers/eventController');

const router = express.Router();

// CRUD
router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    eventController.uploadEventImage,
    eventController.resizeEventImage,
    eventController.createEvent
  );
router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    eventController.uploadEventImage,
    eventController.resizeEventImage,
    eventController.updateEvent
  )
  .delete(eventController.deleteEvent);

module.exports = router;
