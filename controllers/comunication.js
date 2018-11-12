const User = require('../models/user'); // Import User Model Schema
const Comunication = require('../models/comunication'); // Import Comunication Model Schema
const Condominio = require('../models/condominio'); // Import Comunication Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const fs = require('fs');
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
  exports.comunicationImg =  (req, res, next) => {
    const upload = multer({ storage: storage }).array("files[]", 12);
    upload(req, res, function (err) {
        if (err) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
          }
      const comunication = new Comunication({
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
        imgcomunication: req.body.imgcomunication,
        // imageDimension: fileDimension,
        fileUploadDate: Date.now()
      });

      // Save comunication into database
      comunication.save((err, comunication) => {
        // Check if error
        if (err) {

          res.json({ success: false, message: 'problema no envio.' });

        } else {
          res.json({ success: true, message: 'Ticket saved!' }); // Return success message
          console.log(comunication);
        }
    });

      });
    };
  exports.newComunication = (req, res) => {
    // Check if comunication title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Comunication title is required.' }); // Return error message
    } else {
        // Check if comunication's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Comunication creator is required.' }); // Return error
        } else {
          // Create the comunication object for insertion into database
          const comunication = new Comunication({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy, // CreatedBy field
            condominio: req.body.condominio
          });
          // Save comunication into database
          comunication.save((err) => {
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
              res.json({ success: true, message: 'Comunication saved!' }); // Return success message
            }
          });
        }
      }

  };

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  exports.allComunications = (req, res) => {
    // Search database for all comunication posts
    Comunication.find({}, (err, comunications) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        User.findOne({ _id: req.decoded.userId })
        .then((user)=>{console.log(user);
        const results = comunications.filter(comunication => String(comunication.condominio) === String(user.condominio));
         return  res.json({comunications: results});
             })
            }
       })
    }
    exports.DashComunications = (req, res) => {
        // Search database for all comunication posts
        Comunication.find().sort({ '_id': -1 }).limit(5).exec((err, comunications) => {
          // Check if error was found or not
          if (err) {
            res.json({ success: false, message: err }); // Return error message
          } else {
            User.findOne({ _id: req.decoded.userId })
            .then((user)=>{console.log(user);
            const results = comunications.filter(comunication => String(comunication.condominio) === String(user.condominio));
             return  res.json({comunications: results});
                 })
                }
           })
        }

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
 exports.singleComunication = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No comunication ID was provided.' }); // Return error message
    } else {
      // Check if the comunication id is found in database
      Comunication.findOne({ _id: req.params.id }, (err, comunication) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid comunication id' }); // Return error message
        } else {
          // Check if comunication was found by id
          if (!comunication) {
            res.json({ success: false, message: 'Comunication not found.' }); // Return error message
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
                  // Check if the user who requested single comunication is the one who created it
                  if (user.username !== comunication.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this comunication.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, comunication: comunication }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  };
  exports.oneComunication = (req, res)=>{
    var comunicationId = req.params.id;

    Comunication.findById(comunicationId, (err, comunication) => {
      if(err){
        res.status(500).send({message: 'Error en la petición.'});
      }else{
        if(!comunication){
          res.status(404).send({message: 'El comunication no existe'});
        }else{
          res.status(200).send({comunication});

        }
      }
    });
    };
  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  exports.updateComunication = (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No comunication id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Comunication.findOne({ _id: req.body._id }, (err, comunication) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid comunication id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!comunication) {
            res.json({ success: false, message: 'Comunication id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting comunication update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update comunication post
                  if (user.username !== comunication.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this comunication post.' }); // Return error message
                  } else {
                    comunication.title = req.body.title; // Save latest comunication title
                    comunication.body = req.body.body; // Save latest body
                    comunication.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Comunication Updated!' }); // Return success message
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
  exports.deleteComunication = (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Comunication.findOne({ _id: req.params.id }, (err, comunication) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if comunication was found in database
          if (!comunication) {
            res.json({ success: false, messasge: 'Comunication was not found' }); // Return error message
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
                  // Check if user attempting to delete comunication is the same user who originally posted the comunication
                  if (user.username !== comunication.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this comunication post' }); // Return error message
                  } else {
                    // Remove the comunication from database
                    comunication.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comunication deleted!' }); // Return success message
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
