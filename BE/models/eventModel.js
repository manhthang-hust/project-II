const mongoose = require('mongoose');
const date = require('date-and-time');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An event must have name!'],
  },
  content: {
    type: String,
    required: [true, 'An event must have content!'],
  },
  image: {
    type: String,
    required: [true, 'An Event must have an image!'],
  },
  discount: {
    type: Number,
    required: [true, 'An event must have discount!'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start Date for this event!'],
  },
  endDate: Date,
  dayCounter: {
    type: Number,
    required: [true, 'Please provide day counter for this event!'],
    min: [1, 'Day counter for an event must be equal or more than 1 day '],
  },
  minAge: {
    type: Date,
    default: new Date('1900-01-01'),
  },
  maxAge: {
    type: Date,
    default: new Date('2030-01-01'),
  },
  gender: {
    type: String,
    enum: {
      values: ['all', 'male', 'female', 'undefined'],
      message: 'Gender is either: male, female, undefined',
    },
  },
});

/**
 * DOCUMENT MIDDLEWARE
 */
/* EVENT OCCURS -> decrease price of all reading Card of users 
  Depend on:
  - age
  - date*
  - gender
*/
eventSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  // Set end date property
  this.endDate = date.addDays(new Date(this.startDate), this.dayCounter);

  next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
