/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const moment = require('moment')
const momentTz = require('moment-timezone')
const now = moment();
const dateToStore = '2018-01-27 10:30'
moment().utcOffset(); // 60 minutes
const timeZone = 'America/Bahia' // 'UTC-03:00'
// Validate Function to check comunication title length
let titleLengthChecker = (title) => {
  // Check if comunication title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length < 5 || title.length > 5000) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};



// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 5000'
  }
];




// Comunication Model Definition
const comunicationSchema = new Schema({
  title: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  body:{type: String},
  condominio:{type: String},
  createdBy: { type: String },
  createdAt: { type: String, default: () => moment().format("DD-MM-YYYY, HH:mm:ss") },
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimeptype: { type: String },
  destination: { type: String },
  filename: { type: String },
  path: { type: String },
  size: { type: Number }

});



// Export Module/Schema
module.exports = mongoose.model('Comunication', comunicationSchema);
