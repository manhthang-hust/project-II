const AppError = require('../utils/appError');

// Send error for dev
const sendErrorDev = (err, req, res) => {
    // 1) check api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            errorName: err.name,
            message: err.message,
            stack: err.stack,
        });
    }

    // 2) render error website
};

// Send error for production
const sendErrorProd = (err, req, res) => {
    // 1) check api
    if (req.originalUrl.startsWith('/api')) {
        // 1.1) Operational errors: send error to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // 1.2) Programing or other unknown errors: not leak error detail
        /// log error (for dev)
        console.log('ERROR 💥', err);
        console.log('😔 ERROR NAME: ', err.name);

        /// send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }

    // 2) render error website
};

/**
 * ERROR HANDLE MIDDLEWARE
 *
 * @des all err passed into next() function will come to this middleware right away
 *
 * @note write params in this order means this is a error handler middleware
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.name = err.name;
        error.message = err.message;

        sendErrorProd(error, req, res);
    }
};
