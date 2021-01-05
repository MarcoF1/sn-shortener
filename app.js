const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

// import all the express routes we will be using
const indexRouter = require('./routes/index');
const shortsRouter = require('./routes/shorts');
const usersRouter = require('./routes/users');
const sessionRouter = require('./routes/session');

// create our app
const app = express();

// set up user session
app.use(session({
  secret: 'URL-shortener',
  resave: true,
  saveUninitialized: true
}));

// allows us to make requests from POSTMAN
app.use(cors());

// set up the app to use dev logger
app.use(logger('dev'));

// accept json
app.use(express.json());

// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
// allows object nesting in POST
app.use(express.urlencoded({ extended: false }));

// cookies for sessions
app.use(cookieParser());

// server html+css+js frontend
app.use(express.static(path.join(__dirname, 'public')));

// connect url hierarchies to our routers
app.use('/', indexRouter);
app.use('/api/shorts', shortsRouter);
app.use('/api/users', usersRouter);
app.use('/api/users/session', sessionRouter);

app.use('*', function (req, res) {
  res.redirect('/').end();
});

console.log("Running on localhost:3000...");

module.exports = app;
