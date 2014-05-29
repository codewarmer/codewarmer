/**
 * Module dependencies
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

/**
 * Contact schema
 */

var ContactSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    'default': Date.now
  },
  sent: {
    type: Boolean,
    'default': false
  }
});

mongoose.model('Contact', ContactSchema);
