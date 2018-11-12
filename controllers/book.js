const User = require('../models/user'); // Import User Model Schema
const Book = require('../models/book'); // Import Book Model Schema
const Condominio = require('../models/condominio'); // Import Book Model Schema
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
  exports.bookImg =  (req, res, next) => {
    const upload = multer({ storage: storage }).array("files[]", 12);
    upload(req, res, function (err) {
        if (err) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
          }
      const book = new Book({
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
        imgbook: req.body.imgbook,
        // imageDimension: fileDimension,
        fileUploadDate: Date.now()
      });

      // Save book into database
      book.save((err, book) => {
        // Check if error
        if (err) {

          res.json({ success: false, message: 'problema no envio.' });

        } else {
          res.json({ success: true, message: 'Ticket saved!' }); // Return success message
          console.log(book);
        }
    });

      });
    };
  exports.newBook = (req, res) => {
    // Check if book title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Book title is required.' }); // Return error message
    } else {
        // Check if book's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Book creator is required.' }); // Return error
        } else {
          // Create the book object for insertion into database
          const book = new Book({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy, // CreatedBy field
            condominio: req.body.condominio
          });
          // Save book into database
          book.save((err) => {
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
              res.json({ success: true, message: 'Book saved!' }); // Return success message
            }
          });
        }
      }

  };

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  exports.allBooks = (req, res) => {
    // Search database for all book posts
    Book.find({}, (err, books) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if books were found in database
        if (!books) {
          res.json({ success: false, message: 'No books found.' }); // Return error of no books found
        } else {
            User.findOne({ _id: req.decoded.userId })
            .then((user)=>{console.log(user);
                if (user.role === "admcondominio") {
                    const resbooks = books.filter(book => String(book.condominio) === String(user.condominio));
      return  res.json({books: resbooks}), console.log(resbooks);

                  }else{
            const results = books.filter(book => book.createdBy === user.username);
             return  res.json({books: results});
                  }
            })


        }
      }
    }).sort({ '_id': -1 }); // Sort books from newest to oldest
  };

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
 exports.singleBook = (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No book ID was provided.' }); // Return error message
    } else {
      // Check if the book id is found in database
      Book.findOne({ _id: req.params.id }, (err, book) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid book id' }); // Return error message
        } else {
          // Check if book was found by id
          if (!book) {
            res.json({ success: false, message: 'Book not found.' }); // Return error message
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
                  // Check if the user who requested single book is the one who created it
                  if (user.username !== book.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this book.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, book: book }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  };
  exports.oneBook = (req, res) => {
    var bookId = req.params.id;

      Book.findById(bookId, (err, book) => {
        if(err){
          res.status(500).send({message: 'Error en la petición.'});
        }else{
          if(!book){
            res.status(404).send({message: 'El booka no existe'});
          }else{
            res.status(200).send({book});

          }
        }
      });
  }
//   exports.book = (req, res)=>{
//     if (!req.params.id) {
//       res.json({ success: false, message: 'No book ID was provided.' }); // Return error message
//     } else {
//       // Check if the book id is found in database
//       Book.findOne({ _id: req.params.id }, (err, book) => {
//       if(err){
//         res.status(500).send({message: 'Error en la petición.'});
//       }else{
//         User.findOne({ _id: req.decoded.userId }, (err, user) => {
//           // Check if error was found
//           if (err) {
//             res.json({ success: false, message: err }); // Return error message
//           } else {
//             // Check if user was found in the database
//             if (!user) {
//               res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
//             } else {
//               console.log('testando dados book', book);
//       console.log('testando dados book', user.book);
//               // Check if user logged in the the one requesting to update book post
//               if (String(user.book) !== String(book._id)) {
//                 res.json({ success: false, message: 'You are not authorized acessar o condomínio' }); // Return error message
//               } else {
//           res.status(200).send({book});

//       console.log('testando dados book', book);

//           }
//         }
//         }

//       })
//     }
//   })
// }
//     };
  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  exports.updateBook = (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No book id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Book.findOne({ _id: req.body._id }, (err, book) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid book id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!book) {
            res.json({ success: false, message: 'Book id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting book update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update book post
                  if (user.username !== book.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this book post.' }); // Return error message
                  } else {
                    book.title = req.body.title; // Save latest book title
                    book.body = req.body.body; // Save latest body
                    book.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Book Updated!' }); // Return success message
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
  exports.deleteBook = (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Book.findOne({ _id: req.params.id }, (err, book) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if book was found in database
          if (!book) {
            res.json({ success: false, messasge: 'Book was not found' }); // Return error message
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
                  // Check if user attempting to delete book is the same user who originally posted the book
                  if (user.username !== book.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this book post' }); // Return error message
                  } else {
                    // Remove the book from database
                    book.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Book deleted!' }); // Return success message
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
