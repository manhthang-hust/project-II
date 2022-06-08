const express = require('express');

const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');


const app = express();

/**
 * GLOBAL MIDDLEWARE
 *
 * @desc all request will go through these middleware before reaching server
 *
 */

// Allow other websites to access our API
app.use(cors()); // for get, post
app.options('*', cors()); // for patch, delete, cookie,...

// Serve static file
app.use(express.static(path.join(__dirname, 'public')));

// Prevent too many requests from 1 IP in 1 hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 24,
    message: 'Too many requests from this IP, please try again in 1 hour!',
});

app.use('/api', limiter);

// See log request detail
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Compress all text (image is auto compressed)
app.use(compression());

/**
 * ROUTES
 *
 * @desc all routes for api or view
 *
 */
// TODO: Define all routes


/**
 * HANDLE ERRORS
 */
// For undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

// error handler middleware
app.use(globalErrorHandler);

module.exports = app;
