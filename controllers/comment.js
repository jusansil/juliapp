const User = require('../models/user'); // Import User Model Schema
const Comment = require('../models/comment');
const Ticket = require('../models/ticket');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const bodyParser = require('body-parser');


 exports.newComment = (req, res) => {
    const ticketId  = req.decoded.id;
    // Check if comment content was provided
    if (!req.body.content) {
      res.json({ success: false, message: 'Comment content is required.' }); // Return error message
    } else {
        Ticket.findOne(ticketId)
        .then((ticket)=>{

       console.log({ticket: ticket._id});
        // Check if comment's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Comment creator is required.' }); // Return error
        } else {
            const ticketId  = req.decoded.id;
          // Create the comment object for insertion into database
          const comment = new Comment({
            content: req.body.content,
            createdBy: req.body.createdBy,
            ticket: req.body.ticket
          });


          // Save comment into database
          comment.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the content field
                if (err.errors.content) {
                  res.json({ success: false, message: err.errors.content.message }); // Return error message
                }
              }
            } else {
              res.json({ success: true, message: 'Comment saved!' }); // Return success message
            }
          });
        }
    })
    }
  };

  exports.allComments = (req, res) => {
    var ticketId = req.params.id;
    Ticket.findById(ticketId).populate('comments')
     .then((ticket)=>{
        console.log("ticket:", ticket);
        res.json({success: ticket});
    })
  };

