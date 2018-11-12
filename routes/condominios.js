
const CondominioController = require('../controllers/condominio'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');


var api = express.Router();
api.get('/upload/:imageFile',  CondominioController.upload);
api.post('/newCondominio', AuthenticationController.use, CondominioController.newCondominio);
api.get('/allCondominios', AuthenticationController.use, CondominioController.allCondominios);
api.get('/singleCondominio/:id',  AuthenticationController.use, CondominioController.singleCondominio);
api.get('/condominio/:id', AuthenticationController.use, CondominioController.condominio);
api.put('/updateCondominio',  AuthenticationController.use, CondominioController.updateCondominio);
api.delete('/deleteCondominio/:id', CondominioController.deleteCondominio);


module.exports = api;
