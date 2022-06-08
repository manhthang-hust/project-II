const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// Uncaught exception
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

    process.exit(1);
});

// DATABASE (MONGOOSE)
// TODO: modify this depends on your type of DB
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successfully!'));

// server listening
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port} - ${process.env.NODE_ENV}`);
});

// Unhandled Rejection & Sigterm
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');

    // finish all request pending or being handled before close server
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');

    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
