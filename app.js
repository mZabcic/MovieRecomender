var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var musicRouter = require('./routes/music');
var movieRouter = require('./routes/movies');
var weatherRouter = require('./routes/weather');
var config = require('./config');
var jwt = require('express-jwt');
var cron = require('node-cron');
var timeout = require('connect-timeout'); //express v4
var cors = require('cors');
var Genre = require('./models/Genre');
const Weather = require('./models/Weather');


// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
const expressValidator = require('express-validator')


var app = express();

app.use(cors());

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

    app.use(timeout(12000000));
    app.use(haltOnTimedout);
    
    function haltOnTimedout(req, res, next){
      if (!req.timedout) next();
    }


const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'Movie recomender api',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/v1',
        produces: [
            "application/json"
        ],
        schemes: ['http'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "Bearer <token>",
            }
        }
    },
    basedir: '/home/mislavz/Code/FAKS/DM-PROJEKT', //app absolute path
    files: ['./routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)

/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
}); */
 
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
//app.use('/'+ config.version + '/music',jwt({ secret: config.secret, isRevoked : config.isRevoked}), musicRouter);
app.use('/'+ config.version + '/movies',jwt({ secret: config.secret, isRevoked : config.isRevoked}), movieRouter);
app.use('/'+ config.version + '/weather',jwt({ secret: config.secret, isRevoked : config.isRevoked}), weatherRouter);


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ error: 'Invalid token'} );
    }
}); 



Movie = require('./models/Movie');
const sget = require('simple-get')
const log4js = require('log4js');
log4js.configure({
  appenders: { data: { type: 'file', filename: 'data.log' } },
  categories: { default: { appenders: ['data'], level: 'info' } }
});




cron.schedule('0 1 * * *', () => {
    const logger = log4js.getLogger('data');
    updateTMDB();
    updateOMDB();
    updateGenres();
    logger.info("Social data updated");
  }, {
    scheduled: true,
    timezone: "Europe/Zagreb"
});



cron.schedule('0,30 * * * *', () => {
    updateWeather();
  }, {
    scheduled: true,
    timezone: "Europe/Zagreb"
});


const updateTMDB = () => {
    Movie.find({source : "TMDB"}, (err, doc) => {
        doc.forEach(e => {
            var id = e.id.replace('tmdb-','');
            sget.concat({
                url: config.moviedb_url + 'movie/' + id + config.moviedb_apikey,
                method: 'GET',
                json: true
            }, function (err, response, data) {
                Movie.update({ _id: e._id }, { $set: { social_data: {
                    "tmdb_vote_average": data.vote_average,
                    "tmdb_vote_count": data.vote_count
                  }}}, (err, docs) => {
                    console.log(docs);
                });
            })
        });
    })
}

const updateOMDB = () => {
    Movie.find({source : "OMDB"}, (err, doc) => {
        doc.forEach(e => {
            var id = e.id.replace('omdb-','');
            sget.concat({
                url: config.omdb_url + config.omdb_apikey + '&i=' + id,
                method: 'GET',
                json: true
            }, function (err, response, data) {
                Movie.update({ _id: e._id }, { $set: { social_data: {
                    "omdb_rating": data.imdbRating,
                    "omdb_vote_count": data.imdbVotes
                  }}}, (err, docs) => {
                    console.log(docs);
                });
            })
        }); 
    })
}

const updateWeather = () => {
    const logger = log4js.getLogger('data');
    logger.info("Weather data updated");
    sget.concat({
        url: config.weather_url + '?id=3186886&units=metric'  + config.weather_apikey,
        method: 'GET',
        json: true
    }, function (err, response, data) {
        Weather.findOne({id : 3186886}, (err, doc) => {
            Weather.findByIdAndUpdate(
                doc._id,
                data,
                { new: true
                },
                (err, weather) => {
                    if (err) logger.info("Weather data not updated");
                    else 
                    logger.info("Weather data updated");
                }
            )
        })
    })
}



const updateGenres = () => {
    sget.concat({
        url: config.moviedb_url + 'genre/movie/list' + config.moviedb_apikey,
        method: 'GET',
        json: true
    }, function (err, response, data) {
      var allGenres = [];
      data.genres.forEach(e => {
        var g = new Genre(e);
        allGenres.push(g);
      })
      Genre.collection.insert(allGenres, function (err, docs) {
        console.log(docs)
      });
    });
}

module.exports = app;





