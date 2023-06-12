var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var themesRouter = require('./routes/themes');
var expressLayouts = require('express-ejs-layouts');

mongoose.connect('mongodb+srv://project-nodejs-2:Ishi.Red.09@cluster0.1r1zsfn.mongodb.net/');
mongoose.connection.once('open', function() {
  console.log('Mongodb Running')
}).on('error', function(err){
  console.log(err)
})


const kittySchema = new mongoose.Schema({
  name: String
});
const Kitten = mongoose.model('Kitten', kittySchema);
const silence = new Kitten({ name: 'Silence' });
silence.save(function(err, silence) {
  if (err) return console.error(err)
})



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'backend');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/themes', themesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//ket noi bang duong dan nay cho vscode
//mongodb+srv://project-nodejs:Iksss.Red.09@cluster0.1r1zsfn.mongodb.net/


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { pageTitle: 'err' });
});

module.exports = app;
