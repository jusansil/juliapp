/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const ObjectId = mongoose.Schema.Types.ObjectId;


// Ticket Model Definition
const commentSchema = new Schema({
    content:  String ,
    ticket: {type: Schema.Types.ObjectId, ref: 'Ticket'},
    createdBy:  String,
    createdAt: { type: Date, default: Date.now() }
});

// Export Module/Schema
module.exports = mongoose.model('Comment', commentSchema);
