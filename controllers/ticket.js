
const Ticket = require('../models/ticket'); // Import Ticket Model Schema
const Comment = require('../models/comment');
const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Node Tool for MongoDB
const fs = require('fs');
mongoose.Promise = Promise;
const multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
  // set uploads folder
  destination: (req, file, cb) => {
      cb(null, 'public/uploads');
  },
  // set default filename
  filename: (req, file, cb) => {
      cb(null, file.originalname); // overwrites current file with same name!!!
  }
});

  /* ===============================================================
     CREATE NEW BLOG
  =============================================================== */
  exports.upload =  (req, res, next) => {
    var imageFile = req.params.imageFile;
	var path_file = './public/uploads/'+imageFile;
    fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});

  }
  exports.postFile =  (req, res, next) => {
    const upload = multer({ storage: storage }).array("files[]", 12);
    upload(req, res, function (err) {
        if (err) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
          }
      const ticket = new Ticket({
        fieldname: req.files[0].fieldname,
        originalname: req.files[0].originalname,
        encoding: req.files[0].encoding,
        mimetype: req.files[0].mimetype,
        destination:req.files[0].destination,
        filename: req.files[0].filename,
        path: req.files[0].path,
        size: req.files[0].size,
        title: req.body.title, // Title field
    body: req.body.body, // Body field
    createdBy: req.body.createdBy,
    condominio: req.body.condominio,
    imgticket: req.body.imgticket,
        // imageDimension: fileDimension,
        fileUploadDate: Date.now()
      });

      // Save ticket into database
      ticket.save((err, ticket) => {
        // Check if error
        if (err) {

          res.json({ success: false, message: 'problema no envio.' });

        } else {
          res.json({ success: true, message: 'Ticket saved!' }); // Return success message
          console.log(ticket);
        }
    });

      });
    };

    exports.addTicket = (req, res, next) => {
     const ticket = new Ticket({
    title: req.body.title, // Title field
    body: req.body.body, // Body field
    createdBy: req.body.createdBy,
    condominio: req.body.condominio,
    imgticket: req.body.imgticket
  });
  ticket.save((err,Ticket) => {
    if(err){
      result = {'success':false,'message':'Some Error','error':err};
      console.log(result);
    }
    else{
      const result = {'success':true,'message':'Ticket Added Successfully',Ticket}
          console.log(result);
    }
  })
  };
  /* ===============================================================
     Update Ticket
  =============================================================== */
  exports.updateTicket = (io,T) => {
    let result;
    Ticket.findOne({ _id:T.id }, T, { new:true }, (err,ticket) => {
      if(err){
      result = {'success':false,'message':'Some Error','error':err};
      console.log(result);
      }
      else{
       result = {'success':true,'message':'Ticket Updated Successfully',ticket};
       io.emit('TicketUpdated', result);
      }
    })
  }


  /* ===============================================================
     GET ALL TICKETS
  =============================================================== */
  exports.getTickets = (req, res) => {
      Ticket.find().sort({ '_id': -1 })
    .then((tickets )=> {
     User.findOne({ _id: req.decoded.userId })
     .then((user)=>{console.log(user);
     const results = tickets.filter(ticket => String(ticket.condominio) === String(user.condominio));
      return  res.json({tickets: results})
          });

    })
  };
  exports.getDashTickets = (req, res) => {
      // Search database for all ticket posts
      Ticket.find().sort({ '_id': -1 }).limit(5).exec((err, tickets) => {
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          User.findOne({ _id: req.decoded.userId })
          .then((user)=>{console.log(user);
          const results = tickets.filter(ticket => String(ticket.condominio) === String(user.condominio));
           return  res.json({tickets: results}), console.log({verify: results});
               })
              }
         })
};
  exports.oneTicket = (req, res) =>{
    var ticketId = req.params.id;

      Ticket.findById(ticketId).populate('comments').exec((err, tickets) => {

        console.log("tickets:", tickets);
        res.json({success: tickets});

      });

  };
  exports.TicketsComment = (req, res) =>{
    var ticketId = req.params.id;

      Ticket.findById(ticketId).populate('comments').exec((err, ticket) => {

            return  res.json({ticket: ticket}), console.log('TicketsComment', ticket);

      });

  };
  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
  exports.SingleTicket = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No ticket ID was provided.' }); // Return error message
    } else {
      // Check if the ticket id is found in database
      Ticket.findOne({ _id: req.params.id }, (err, ticket) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid ticket id' }); // Return error message
        } else {
          // Check if ticket was found by id
          if (!ticket) {
            res.json({ success: false, message: 'Ticket not found.' }); // Return error message
          } else {
            // Find the current user that is logged in
            res.json({ success: true, ticket: ticket }); // Return success
          }
        }
      });
    }
  };


  /* ===============================================================
     DELETE BLOG POST
  =============================================================== */
  exports.deleteTicket = (req, res) =>{
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Ticket.findOne({ _id: req.params.id }, (err, ticket) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if ticket was found in database
          if (!ticket) {
            res.json({ success: false, messasge: 'Ticket was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete ticket is the same user who originally posted the ticket
                  if (user.username !== ticket.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this ticket post' }); // Return error message
                  } else {
                    // Remove the ticket from database
                    ticket.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Ticket deleted!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  };

  /* ===============================================================
     LIKE BLOG POST
  =============================================================== */
  exports.likeTicket = (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Ticket.findOne({ _id: req.body.id }, (err, ticket) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid ticket id' }); // Return error message
        } else {
          // Check if id matched the id of a ticket post in the database
          if (!ticket) {
            res.json({ success: false, message: 'That ticket was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the ticket post
                  if (user.username === ticket.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the ticket post before
                    if (ticket.likedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (ticket.dislikedBy.includes(user.username)) {
                        ticket.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = ticket.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                        ticket.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        ticket.likes++; // Increment likes
                        ticket.likedBy.push(user.username); // Add username to the array of likedBy array
                        // Save ticket post data
                        ticket.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Ticket liked!' }); // Return success message
                          }
                        });
                      } else {
                        ticket.likes++; // Incriment likes
                        ticket.likedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save ticket post
                        ticket.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Ticket liked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  };

  /* ===============================================================
     DISLIKE BLOG POST
  =============================================================== */
  exports.dislikeTicket = (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for ticket post using the id
      Ticket.findOne({ _id: req.body.id }, (err, ticket) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid ticket id' }); // Return error message
        } else {
          // Check if ticket post with the id was found in the database
          if (!ticket) {
            res.json({ success: false, message: 'That ticket was not found.' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the ticket post
                  if (user.username === ticket.createdBy) {
                    res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (ticket.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (ticket.likedBy.includes(user.username)) {
                        ticket.likes--; // Decrease likes by one
                        const arrayIndex = ticket.likedBy.indexOf(user.username); // Check where username is inside of the array
                        ticket.likedBy.splice(arrayIndex, 1); // Remove username from index
                        ticket.dislikes++; // Increase dislikeds by one
                        ticket.dislikedBy.push(user.username); // Add username to list of dislikers
                        // Save ticket data
                        ticket.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Ticket disliked!' }); // Return success message
                          }
                        });
                      } else {
                        ticket.dislikes++; // Increase likes by one
                        ticket.dislikedBy.push(user.username); // Add username to list of likers
                        // Save ticket data
                        ticket.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Ticket disliked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  };


