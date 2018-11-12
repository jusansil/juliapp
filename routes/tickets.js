
const TicketController = require('../controllers/ticket'); // Import authentication

const AuthenticationController = require('../controllers/authentication'), // Import authentication
express = require('express');

var api = express.Router();
// api.post('/postFile', AuthenticationController.use, TicketController.postFile);
api.get('/upload/:imageFile',  TicketController.upload);
 api.post('/addTicket',  TicketController.addTicket);
 api.post('/postFile',  TicketController.postFile);
 api.get('/getTickets',   TicketController.getTickets);
 api.get('/getDashTickets',  AuthenticationController.use, TicketController.getDashTickets);
//api.get('/allTickets',  AuthenticationController.use, AuthenticationController.roleAuthorization(['admin']), TicketController.allTickets);
api.get('/oneTickets/:id',  TicketController.oneTicket);
api.get('/TicketsComment',  AuthenticationController.use, TicketController.TicketsComment);
api.get('/SingleTicket/:id',  TicketController.SingleTicket);
api.put('updateTicket', TicketController.updateTicket);
api.delete('/deleteTicket/:id', TicketController.deleteTicket);
api.put('likeTicket', TicketController.likeTicket);
api.put('dislikeTicket', TicketController.dislikeTicket);

module.exports = api;
