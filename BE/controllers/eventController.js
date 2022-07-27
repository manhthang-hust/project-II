const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const Event = require('../models/eventModel');

/* UPLOAD IMAGE & PROCESS IMAGE */
// Upload event image
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

exports.uploadEventImage = upload.single('image');

// resize image to square
exports.resizeEventImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (req.params.id)
    req.body.image = `event-${req.params.id}-${Date.now()}.jpeg`;
  else req.body.image = `event-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/events/${req.body.image}`);

  next();
});

/**
 * CRUD
 */
exports.getAllEvents = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    result: events.length,
    data: {
      events,
    },
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  const newEvent = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent,
    },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) return next(new AppError('No Event found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent)
    return next(new AppError('No Event found with that ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      event: updatedEvent,
    },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const deletedEvent = await Event.findByIdAndDelete(req.params.id);

  if (!deletedEvent)
    return next(new AppError('No Event found with that ID!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
