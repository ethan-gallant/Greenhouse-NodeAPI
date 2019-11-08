const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/client');

const logsRouter = require('./routes/logs');

const app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clients', clientsRouter);
app.use('/logs', logsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.send({"err":"not found"}).end();
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
