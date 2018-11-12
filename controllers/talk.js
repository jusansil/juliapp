const User = require('../models/user'); // Import User Model Schema
const Talk = require('../models/talk'); // Import Talk Model Schema
const Condominio = require('../models/condominio'); // Import Talk Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration



  /* ===============================================================
     CREATE NEW BLOG
  =============================================================== */
  exports.newTalk = (req, res) => {
    // Check if talk title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Talk title is required.' }); // Return error message
    } else {
        // Check if talk's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Talk creator is required.' }); // Return error
        } else {
          // Create the talk object for insertion into database
          const talk = new Talk({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy, // CreatedBy field
            condominio: req.body.condominio
          });
          // Save talk into database
          talk.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Talk saved!' }); // Return success message
            }
          });
        }
      }
    
  };

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  exports.allTalks = (req, res) => {
    // Search database for all talk posts
    Talk.find({}, (err, talks) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if talks were found in database
        if (!talks) {
          res.json({ success: false, message: 'No talks found.' }); // Return error of no talks found
        } else {
          res.json({ success: true, talks: talks }); // Return success and talks array
         
        }
      }
    }).sort({ '_id': -1 }); // Sort talks from newest to oldest
  };

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
 exports.singleTalk = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No talk ID was provided.' }); // Return error message
    } else {
      // Check if the talk id is found in database
      Talk.findOne({ _id: req.params.id }, (err, talk) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid talk id' }); // Return error message
        } else {
          // Check if talk was found by id
          if (!talk) {
            res.json({ success: false, message: 'Talk not found.' }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                } else {
                  // Check if the user who requested single talk is the one who created it
                  if (user.username !== talk.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this talk.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, talk: talk }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  };
  exports.talk = (req, res)=>{
    var talkId = req.params.id;
    
    Talk.findById(talkId, (err, talk) => {
      if(err){
        res.status(500).send({message: 'Error en la petición.'});
      }else{
        if(!talk){
          res.status(404).send({message: 'El talk no existe'});
        }else{
          res.status(200).send({talk});
         
        }
      }
    });
    };  
  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  exports.updateTalk = (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No talk id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Talk.findOne({ _id: req.body._id }, (err, talk) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid talk id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!talk) {
            res.json({ success: false, message: 'Talk id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting talk update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update talk post
                  if (user.username !== talk.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this talk post.' }); // Return error message
                  } else {
                    talk.title = req.body.title; // Save latest talk title
                    talk.body = req.body.body; // Save latest body
                    talk.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Talk Updated!' }); // Return success message
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
     DELETE BLOG POST
  =============================================================== */
  exports.deleteTalk = (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Talk.findOne({ _id: req.params.id }, (err, talk) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if talk was found in database
          if (!talk) {
            res.json({ success: false, messasge: 'Talk was not found' }); // Return error message
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
                  // Check if user attempting to delete talk is the same user who originally posted the talk
                  if (user.username !== talk.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this talk post' }); // Return error message
                  } else {
                    // Remove the talk from database
                    talk.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Talk deleted!' }); // Return success message
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
