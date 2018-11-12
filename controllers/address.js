const User = require('../models/user'); // Import User Model Schema
const Address = require('../models/address'); // Import Address Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration



  /* ===============================================================
     CREATE NEW BLOG
  =============================================================== */
  exports.newAddress = (req, res) => {

   
      if (!req.body.street) {
        res.json({ success: false, message: 'Address street is required.' }); // Return error message
      } else {
        // Check if address's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Address creator is required.' }); // Return error
        } else {
          // Create the address object for insertion into database
          const address = new Address({
            street: req.body.street, // Title field
            numero: req.body.cep,
            cep: req.body.numero, // Body field
            complemento: req.body.complemento, // Title field
            bairro: req.body.bairro, // Body field
            cidade: req.body.cidade, // Title field
            estado: req.body.estado, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save address into database
          address.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the street field
                if (err.errors.street) {
                  res.json({ success: false, message: err.errors.street.message }); // Return error message
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
              res.json({ success: true, message: 'Address saved!' }); // Return success message
            }
          });
        }
     
    }
  };

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  exports.allAddresses = (req, res) => {
    // Search database for all address posts
    Address.find({}, (err, addresses) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if addresses were found in database
        if (!addresses) {
          res.json({ success: false, message: 'No addresses found.' }); // Return error of no addresses found
        } else {
          res.json({ success: true, addresses: addresses }); // Return success and addresses array
        }
      }
    }).sort({ '_id': -1 }); // Sort addresses from newest to oldest
  };

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
  exports.singleAddress = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No address ID was provided.' }); // Return error message
    } else {
      // Check if the address id is found in database
      Address.findOne({ _id: req.params.id }, (err, address) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid address id' }); // Return error message
        } else {
          // Check if address was found by id
          if (!address) {
            res.json({ success: false, message: 'Address not found.' }); // Return error message
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
                  // Check if the user who requested single address is the one who created it
                  if (user.username !== address.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this address.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, address: address }); // Return success
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
     UPDATE BLOG POST
  =============================================================== */
  exports.updateAddress = (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No address id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Address.findOne({ _id: req.body._id }, (err, address) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid address id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!address) {
            res.json({ success: false, message: 'Address id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting address update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update address post
                  if (user.username !== address.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this address post.' }); // Return error message
                  } else {
                    address.street = req.body.street; // Save latest address street
                    address.body = req.body.body; // Save latest body
                    address.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Address Updated!' }); // Return success message
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
  exports.deleteAddress = (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Address.findOne({ _id: req.params.id }, (err, address) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if address was found in database
          if (!address) {
            res.json({ success: false, messasge: 'Address was not found' }); // Return error message
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
                  // Check if user attempting to delete address is the same user who originally posted the address
                  if (user.username !== address.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this address post' }); // Return error message
                  } else {
                    // Remove the address from database
                    address.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Address deleted!' }); // Return success message
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

