const User = require('../models/user'); // Import User Model Schema
const Condominio = require('../models/condominio'); // Import Condominio Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
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
  /* ===============================================================
     CREATE NEW BLOG
  =============================================================== */
  exports.newCondominio = (req, res) => {
    // Check if condominio title was provided

            const upload = multer({ storage: storage }).array("files[]", 12);
            upload(req, res, function (err) {
                if (err) {
                    var file_path = req.files.image.path;
                    var file_split = file_path.split('\\');
                    var file_name = file_split[2];
                    var ext_split = file_name.split('\.');
                    var file_ext = ext_split[1];
                  }
          // Create the condominio object for insertion into database
          const condominio = new Condominio({
            fieldname: req.files[0].fieldname,
            originalname: req.files[0].originalname,
            encoding: req.files[0].encoding,
            mimetype: req.files[0].mimetype,
            destination:req.files[0].destination,
            filename: req.files[0].filename,
            path: req.files[0].path,
            size: req.files[0].size,
            title: req.body.title, // Title field
           address: req.body.address, // Title field
           // body: req.body.body, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save condominio into database
          condominio.save((err) => {
            if(err){
                result = {'success':false,'message':'Some Error','error':err};
                console.log(result);
              }
              else{
                const result = {'success':true,'message':'Condominio Added Successfully',Condominio}
                    console.log(result);
              }

            })
        })




  };

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  exports.allCondominios = (req, res) => {
    // Search database for all condominio posts
    Condominio.find({}, (err, condominios) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if condominios were found in database
        if (!condominios) {
          res.json({ success: false, message: 'No condominios found.' }); // Return error of no condominios found
        } else {
          res.json({ success: true, condominios: condominios }); // Return success and condominios array

        }
      }
    }).sort({ '_id': -1 }); // Sort condominios from newest to oldest
  };

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
 exports.singleCondominio = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No condominio ID was provided.' }); // Return error message
    } else {
      // Check if the condominio id is found in database
      Condominio.findOne({ _id: req.params.id }, (err, condominio) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid condominio id' }); // Return error message
        } else {
          // Check if condominio was found by id
          if (!condominio) {
            res.json({ success: false, message: 'Condominio not found.' }); // Return error message
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
                  // Check if the user who requested single condominio is the one who created it
                  if (user.username !== condominio.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this condominio.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, condominio: condominio }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  };
  exports.condominio = (req, res)=>{
    if (!req.params.id) {
      res.json({ success: false, message: 'No condominio ID was provided.' }); // Return error message
    } else {
      // Check if the condominio id is found in database
      Condominio.findOne({ _id: req.params.id }, (err, condominio) => {
      if(err){
        res.status(500).send({message: 'Error en la petición.'});
      }else{
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error message
          } else {
            // Check if user was found in the database
            if (!user) {
              res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
            } else {
              console.log('testando dados condominio', condominio);
      console.log('testando dados condominio', user.condominio);
              // Check if user logged in the the one requesting to update condominio post
              if (String(user.condominio) !== String(condominio._id)) {
                res.json({ success: false, message: 'You are not authorized acessar o condomínio' }); // Return error message
              } else {
          res.status(200).send({condominio});

      console.log('testando dados condominio', condominio);

          }
        }
        }

      })
    }
  })
}
    };
  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  exports.updateCondominio = (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No condominio id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Condominio.findOne({ _id: req.body._id }, (err, condominio) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid condominio id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!condominio) {
            res.json({ success: false, message: 'Condominio id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting condominio update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update condominio post
                  if (user.username !== condominio.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this condominio post.' }); // Return error message
                  } else {
                    const upload = multer({ storage: storage }).array("files[]", 12);
                    upload(req, res, function (err) {
                        if (err) {
                            var file_path = req.files.image.path;
                            var file_split = file_path.split('\\');
                            var file_name = file_split[2];
                            var ext_split = file_name.split('\.');
                            var file_ext = ext_split[1];
                          }
                          condominio.fieldname=req.files[0].fieldname,
                          condominio.originalname=req.files[0].originalname,
                          condominio.encoding=req.files[0].encoding,
                          condominio.mimetype=req.files[0].mimetype,
                          condominio.destination=req.files[0].destination,
                          condominio.filename=req.files[0].filename,
                          condominio.path=req.files[0].path,
                          condominio.size=req.files[0].size,
                    condominio.title = req.body.title; // Save latest condominio title
                    condominio.body = req.body.body; // Save latest body

                    condominio.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Condominio Updated!' }); // Return success message
                      }
                    });
                  })
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
  exports.deleteCondominio = (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Condominio.findOne({ _id: req.params.id }, (err, condominio) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if condominio was found in database
          if (!condominio) {
            res.json({ success: false, messasge: 'Condominio was not found' }); // Return error message
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
                  // Check if user attempting to delete condominio is the same user who originally posted the condominio
                  if (user.username !== condominio.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this condominio post' }); // Return error message
                  } else {
                    // Remove the condominio from database
                    condominio.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Condominio deleted!' }); // Return success message
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
