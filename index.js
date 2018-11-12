/* ===================
   Import Node Modules
=================== */
const env = require('./env');
const express = require ('express');
const app = express(); // Initiate Express Application
logger = require('morgan');
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;
const config = require('./config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const socketEvents = require('./socketEvents');
const addresses = require('./routes/addresses');
const authentication = require('./routes/authentication'); // Import Authentication Routes
const books = require('./routes/books');
const comments = require('./routes/comments');
const comunications = require('./routes/comunications');
const condominios = require('./routes/condominios');
const talks = require('./routes/talks');
const tickets = require('./routes/tickets'); // Import Ticket Routes
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const SourceMapSupport = require('source-map-support');
app.set('port', (process.env.PORT || 8080));
const server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
const io = require('socket.io').listen(server);
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.


 // Allows heroku to set port
// Database Connection
mongoose.connect(config.uri,  { useNewUrlParser: true }, (err) => {
  // Check if database was able to connect
  if (err) {
    console.log('Could NOT connect to database: ', err); // Return error message
  } else {
    console.log('Connected to ' + config.db); // Return success message
  }
});

// Middleware
app.use(cors('Access-Control-Allow-Origin', '*'));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(logger('dev'));


// socket.io connection
io.on('connection', (socket) => {
    console.log("Connected to Socket!!"+ socket.id);
    // Receiving Tickets from client
    socket.on('addTicket', (ticket) => {
      console.log('socketData: ', ticket);
      io.emit('ticket', ticket);
      console.log('data emit: ', ticket);

    });
    socket.on('addComment', (comment) => {
        console.log('socketData: ', comment);
        io.emit('comment', comment);
        console.log('data emit: ', comment);

      });
  })
  SourceMapSupport.install();
  app.use('/api', addresses);
  app.use('/api', authentication); // Use Authentication routes in application
  app.use('/api', books);
  app.use('/api', comments);
  app.use('/api', comunications);
  app.use('/api', condominios);
  app.use('/api', talks);
  app.use('/api', tickets);
  app.use('/static', express.static(__dirname + '/public'));
  app.get('/', (req,res) => {
      return res.end('Api working');
    });
    app.use((req, res, next) => {
        res.status(404).send('<h2 align=center>Page Not Found!</h2>');
      });
// Start Server: Listen on port 8080


