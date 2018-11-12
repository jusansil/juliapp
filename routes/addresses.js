
const AddressController = require('../controllers/address'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');


var api = express.Router();

api.post('/newAddress', AuthenticationController.use, AddressController.newAddress);
api.get('/allAddresses',  AuthenticationController.use, AddressController.allAddresses);
api.get('/singleAddress/:id', AuthenticationController.use, AddressController.singleAddress);
api.put('updateAddress', AddressController.updateAddress);
api.delete('/deleteAddress', AddressController.deleteAddress);


module.exports = api;
