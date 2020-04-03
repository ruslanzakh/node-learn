var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config');
const authentic = require('./authentic');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
const uploadRouter = require('./routes/uploadRouter');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => console.error(err));

var app = express();
app.all('*', (req, res, next) => {
  if(req.secure) {
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));


app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageupload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new fileStore()
// }))

// app.use(passport.initialize());
// app.use(passport.session());
// session
// function auth(req, res, next) {
//   console.log(req.session);

//   if(!req.session.user) {
//     const err = new Error('You are no authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
    
//   } else {
//     if(req.session.user === 'authenticated') {
//       next();
//     } else {
//       const err = new Error('You are no authenticated');
//       err.status = 401;
//       return next(err);
//     }
//   }

// }
// Cookie auth
// function auth(req, res, next) {
//   console.log(req.signedCookies);

//   if(!req.signedCookies.user) {

//     const authHeader = req.headers.authorization;
//     if(!authHeader) {
//       const err = new Error('You are no authenticated');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     } 
//     const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     const [username, password] = auth;
//     if(username === 'admin' && password === 'password') {
//       res.cookie('user', 'admin', {signed: true})
//       next();
//     } else {
//       const err = new Error('You are no authenticated');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
//   } else {
//     if(req.signedCookies.user === 'admin') {
//       next();
//     } else {
//       const err = new Error('You are no authenticated');
//       err.status = 401;
//       return next(err);
//     }
//   }

// }

// Basic Auth
// function auth(req, res, next) {
//   console.log(req.headers);

//   const authHeader = req.headers.authorization;
//   if(!authHeader) {
//     const err = new Error('You are no authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   } 
//   const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
//   const [username, password] = auth;
//   if(username === 'admin' && password === 'password') {
//     next();
//   } else {
//     const err = new Error('You are no authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   }
// }