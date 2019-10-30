var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
// const express = require('express');
//passport file =====================
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
//====================================

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//mmiddleware setup
app.use(helmet());


//passport configuration=============================
app.use(session({
  secret: 'i love express',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require('./config')
passport.use(new GitHubStrategy(passportConfig,
//verify callback
function(accessToken, refreshToken, profile, cb){
  // console.log(profile)
  return cb(null, profile);
}
));

// passport.serializeUser((user, cb)=>{
//   cb(null, user);
// })
// passport.deserializeUser((user, cb)=>{
//   cb(null, user);
// })

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//==============================

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
