const mongoose = require('mongoose');
const slugify = require('vietnamese-slug');
const Category = require('./categoryModel');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name!'],
      trim: true,
      unique: true,
    },
    slug: String,
    image: {
      type: String,
      required: [true, 'A book must have an image!'],
    },
    publisher: {
      type: String,
      required: [true, 'A book must have a publisher'],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      default: 0,
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    description: String,
    registerUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A book must have belong to a category!'],
    },
    author: {
      type: String,
      required: [true, 'A book must have an author!'],
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTY: Access bookCopies on Book
bookSchema.virtual('bookCopies', {
  ref: 'BookCopy',
  foreignField: 'book',
  localField: '_id',
});

/* DOCUMENT MIDDLEWARE */
// CREATE SLUG FOR BOOK
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name);

  next();
});

/**
 * UPDATE *BOOKS_QUANTITY* OF CATEGORY AFTER CREATING A BOOK
 */
// CALCULATE SUM OF QUANTITY OF BOOK
bookSchema.statics.calcNumBooks = async function (categoryId) {
  const stats = await this.aggregate([
    {
      $match: { category: categoryId },
    },
    {
      $group: {
        _id: '$category',
        numBooks: { $sum: '$quantity' },
      },
    },
  ]);

  if (stats.length === 0)
    await Category.findByIdAndUpdate(categoryId, {
      booksQuantity: 0,
    });
  else
    await Category.findByIdAndUpdate(categoryId, {
      booksQuantity: stats[0].numBooks,
    });
};

// UPDATE BOOKS_QUANTITY AFTER CREATING A BOOK
bookSchema.post('save', function () {
  this.constructor.calcNumBooks(this.category);
});

// UPDATE BOOKS_QUANTITY AFTER DELETING OR UPDATE BOOK
bookSchema.pre(/^findOneAnd/, async function (next) {
  this.b = await this.findOne();
});
bookSchema.post(/^findOneAnd/, function () {
  this.b.constructor.calcNumBooks(this.b.category._id);
});

/**
 * QUERY MIDDLEWARE
 */
/* POPULATE CATEGORY NAME */
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });

  next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
