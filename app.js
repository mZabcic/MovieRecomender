var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./config');
var jwt = require('express-jwt');




// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
const expressValidator = require('express-validator')


var app = express();

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');



const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: '/home/mislavz/Code/FAKS/DM-PROJEKT', //app absolute path
    files: ['./routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
// error handler, required as of 0.3.0
app.use(function(err, req, res, next){
    res.status(400).json(err);
  });
app.use(expressValidator())
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/dm', { useNewUrlParser: true } );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/'+ config.version + '/', indexRouter);
app.use('/'+ config.version + '/users',jwt({ secret: config.secret, isRevoked : config.isRevoked}), usersRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ error: 'Invalid token'} );
    }
}); 

module.exports = app;


