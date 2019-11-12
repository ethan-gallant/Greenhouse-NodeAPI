const express = require('express');
const logger = require('morgan');
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/client');
const authRouter = require('./routes/auth');
const logsRouter = require('./routes/logs');
const jwtVerifier = require('./jwthandler').verifyJWT;
const app = express();
require('dotenv').config();

if(!process.env.JWT_SECRET)
  process.env.JWT_SECRET = "SUPER-SECRET-PASSWORD_LUL_:D";

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
//configures body parser to parse JSON
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth',authRouter);
app.use('/', indexRouter);

app.use(jwtVerifier);

app.use('/users', usersRouter);
app.use('/clients', clientsRouter);
app.use('/logs', logsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({"err":"not found"}).end();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({"err":"The server encountered an internal error"}).end();
});

module.exports = app;
