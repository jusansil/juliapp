
const ComunicationController = require('../controllers/comunication'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');


var api = express.Router();
api.get('/upload/:imageFile',  ComunicationController.upload);
api.post('/newComunication', AuthenticationController.use, ComunicationController.newComunication);
api.get('/allComunications', AuthenticationController.use, ComunicationController.allComunications);
api.get('/DashComunications', AuthenticationController.use, ComunicationController.DashComunications);
api.get('/singleComunication/:id',  AuthenticationController.use, ComunicationController.singleComunication);
api.get('/oneComunication/:id', AuthenticationController.use, ComunicationController.oneComunication);
api.put('/updateComunication',  AuthenticationController.use, ComunicationController.updateComunication);
api.delete('/deleteComunication/:id', ComunicationController.deleteComunication);
api.post('/comunicationImg',  AuthenticationController.use, ComunicationController.comunicationImg);
module.exports = api;
