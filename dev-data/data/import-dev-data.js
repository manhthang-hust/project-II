/**
 * @brief use command to import/delete all data prepared
 * node dev-data\data\import-dev-data.js --import
 * node dev-data\data\import-dev-data.js --delete
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: './config.env' });

// CONNECT TO DB
// TODO: modify this depends on your kind of DB
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB connection successfully!'));

// TODO: Read data

// IMPORT DATA
const importData = async () => {
    try {
        // TODO: import data

        console.log('Import data successfully!');
    } catch (err) {
        console.log(err);
    }

    process.exit();
};

// DELETE DATA
const deleteData = async () => {
    try {
        // TODO: delete data

        console.log('Delete data successfully!');
    } catch (err) {
        console.log(err);
    }

    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
