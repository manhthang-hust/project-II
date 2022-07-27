const express = require('express');
const morgan = require('morgan');
const path = require('path');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const bookRouter = require('./routes/bookRoutes');
const bookCopyRouter = require('./routes/bookCopyRoutes');
const orderRouter = require('./routes/orderRoutes');
const eventRouter = require('./routes/eventRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// DEFINE VIEW ENGINE: PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// USE STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

/* MIDDLEWARE */
// ALLOW TO SHARE APIs
app.use(cors()); // for GET, POST
app.options('*', cors()); // for PATCH, DELETE, UPDATE

// LOG REQUEST
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// BODY PARSER
app.use(express.json());

// cookies parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compress all text
app.use(compression());

/* ROUTES */
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/bookCopies', bookCopyRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/events', eventRouter);

// Handle Unhandled routes
app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);

module.exports = app;
