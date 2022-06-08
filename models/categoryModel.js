const mongoose = require('mongoose');
const validator = require('validator');

const categorySchema = new mongoose.Schema(
    {       
        name: {
            type: String,
            require: [true, "Category must have a name!"],
            unique: true
        },
        slug: String,
        booksQuantity: {
            type: Number,
            default: 0,
        }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;