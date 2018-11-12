
const BookController = require('../controllers/book'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');


var api = express.Router();
api.get('/upload/:imageFile',  BookController.upload);
api.post('/newBook', AuthenticationController.use, BookController.newBook);
api.get('/allBooks', AuthenticationController.use, BookController.allBooks);
api.get('/singleBook/:id',  AuthenticationController.use, BookController.singleBook);
api.get('/oneBook/:id', AuthenticationController.use, BookController.oneBook);
api.put('/updateBook',  AuthenticationController.use, BookController.updateBook);
api.delete('/deleteBook/:id', BookController.deleteBook);
api.post('/bookImg',  AuthenticationController.use, BookController.bookImg);

module.exports = api;
