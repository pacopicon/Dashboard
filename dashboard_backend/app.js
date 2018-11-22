require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser 			= require('cookie-parser');
const passport = require('passport');
const morgan      			= require('morgan');
const routes = require('./routes');

// create our Express app
const app = express();

app.use(morgan('dev'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Passport init
// app.use(passport.initialize());
// app.use(passport.session());

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,x-access-token');
  next();
}
app.use(allowCrossDomain);


// Set Port
app.set('port', (process.env.BACKEND_PORT || 3001));

// Start the server
var server = app.listen(app.get('port'), function() {
  console.log('🤘 🤘 🤘 Express server listening on port ' + app.get('port') + '🤘 🤘 🤘');
});