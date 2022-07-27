const mongoose = require('mongoose');
const slugify = require('vietnamese-slug');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name!'],
      unique: true,
    },
    slug: String,
    booksQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// VIRTUAL POPULATE
categorySchema.virtual('books', {
  ref: 'Book',
  foreignField: 'category',
  localField: '_id',
});

// CREATE SLUG BY NAME BEFORE SAVING
categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name);

  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
