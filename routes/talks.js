
const TalkController = require('../controllers/talk'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');


var api = express.Router();
api.post('/newTalk', AuthenticationController.use, TalkController.newTalk);
api.get('/allTalks', AuthenticationController.use, TalkController.allTalks);
api.get('/singleTalk/:id',  AuthenticationController.use, TalkController.singleTalk);
api.get('/talk/:id', AuthenticationController.use, TalkController.talk);
api.put('/updateTalk',  AuthenticationController.use, TalkController.updateTalk);
api.delete('/deleteTalk/:id', TalkController.deleteTalk);

module.exports = api;
