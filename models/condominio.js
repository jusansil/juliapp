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
// Condominio Model Definition
const condominioSchema = new Schema({
  title: { type: String},
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: String },
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
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
module.exports = mongoose.model('Condominio', condominioSchema);
