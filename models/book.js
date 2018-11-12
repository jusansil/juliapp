/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


// Book Model Definition
const bookSchema = new Schema({
  title: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  body:{type: String},
  condominio:{type: String},
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
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
module.exports = mongoose.model('Book', bookSchema);
