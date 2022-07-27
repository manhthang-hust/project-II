const AppError = require('../utils/appError');

/* TOKEN */
// invalid token
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// Toke expires
const handleJWTExpiredError = () =>
  new AppError('Your token is expired! Please log in again.', 401);

// HANDLE CAST_ERROR: Invalid Id
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// HANDLE DUPLICATE FIELDS ERROR: (code: 11000)
const handleDuplicateFieldsDB = (err) => {
  const values = Object.values(err.keyValue).join(', ');
  const message = `Duplicate field value: ${values}. Please try another value!`;

  return new AppError(message, 400);
};

// HANDLE VALIDATION ERROR
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// SEND ERROR FOR DEV
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    errorName: err.name,
    message: err.message,
    stack: err.stack,
  });
};

// SEND ERROR FOR PRODUCTION
const sendErrorProd = (err, req, res) => {
  // a) Operational, trusted errors: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // b) Programming or other unknown error: do not leak error detail
  // 1) Log error
  console.log('ERROR 💥', err);
  console.log('😔 ERROR NAME: ', err.name);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
