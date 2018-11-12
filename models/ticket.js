/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const ObjectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment')
const momentTz = require('moment-timezone')
const now = moment();
const dateToStore = '2018-01-27 10:30'
moment().utcOffset(); // 60 minutes
const timeZone = 'America/Bahia' // 'UTC-03:00'

// Ticket Model Definition
const ticketSchema = new Schema({
  title: { type: String },
  body: { type: String },
  createdBy: { type: String },
  createdAt: { type: String, default: () => moment().format("DD-MM-YYYY, HH:mm:ss") },
  imgticket: { type: String },
  condominio: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array },
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimeptype: { type: String },
  destination: { type: String },
  filename: { type: String },
  path: { type: String },
  size: { type: Number },
  },
  {  toJSON: {virtuals: true},
 toObjetic: {virtuals: true}
});

ticketSchema.virtual('comments',{
ref: 'Comment',
localField:'_id',
foreignField:'ticket'
});

// Export Module/Schema
module.exports = mongoose.model('Ticket', ticketSchema);
