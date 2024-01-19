var createError   = require('http-errors');
var express       = require('express');
var cors          = require('cors')
var morgan        = require('morgan')
var colors        = require('colors')
var cookieParser  = require('cookie-parser')
var helmet        = require('helmet')
var xss           = require('xss-clean')
var cors          = require('cors')
const validator   = require('express-validator'); 
const rateLimit   = require('express-rate-limit')

const mongoose = require('mongoose');

var app = express();
app.use(express.json());
app.use(cors())
app.use(morgan('tiny'))
app.use(validator());
app.use(cookieParser())
app.use(helmet())
app.use(xss())
app.use(cors())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const pathConfig        = require('./path');
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';

global.__path_schemas     = __path_app + pathConfig.folder_schemas + '/';
global.__path_models      = __path_app + pathConfig.folder_models + '/';
global.__path_routers     = __path_app + pathConfig.folder_routers + '/';
global.__path_configs     = __path_app + pathConfig.folder_configs + '/';
global.__path_validates   = __path_app + pathConfig.folder_validates + '/';
global.__path_data        = __path_app + pathConfig.folder_data + '/';
global.__path_utils       = __path_app + pathConfig.folder_utils + '/';
global.__path_middleware  = __path_app + pathConfig.folder_middleware + '/';



const systemConfig    = require(__path_configs + 'system');
const databaseConfig  = require(__path_configs + 'database');
var errorHandler      = require(__path_middleware + 'error');

// Local variable
app.locals.systemConfig = systemConfig;

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.1r1zsfn.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`)
  .then(()=> {
    console.log('Database connected'.yellow);
  })
  .catch((error)=> {
    console.log('Error connecting to database'.red);
  });

// Setup router
app.use('/api/v1/', require(__path_routers));
app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.end('Error App');
// });

module.exports = app;

