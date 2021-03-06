var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 /**
 * 
 * @typedef Movie
 * @property {string} _id
 * @property {string} name
 * @property {Array.<string>} genre
 * @property {string} cover 
 * @property {string} release_date Unix timestamp
 * @property {string} id Format is <source>-Id of resource in source
 * @property {string} directed_by
 *  @property {any} social_data 
 * @property {string} description
 * @property {string} source  FB,Custom,TMDB,OMDB
 * @property {string} link  
 */

  /**
 * 
 * @typedef MovieLeader
 * @property {string} _id
 * @property {string} name
 * @property {Array.<string>} genre
 * @property {string} cover 
 * @property {string} release_date Unix timestamp
 * @property {string} id Format is <source>-Id of resource in source
 * @property {string} directed_by
 *  @property {any} social_data 
 * @property {string} description
 * @property {string} source  FB,Custom,TMDB,OMDB
 * @property {number} usersLiked  Number of users that liked this movie in DB
  * @property {string} link  
 */


 /**
 * 
 * @typedef CreateMovie
 * @property {string} name
 * @property {string} genre 
 * @property {string} cover 
 * @property {string} release_date Unix timestamp
 * @property {string} directed_by
 * @property {string} description
 */

 /**
 * 
 * @typedef SearchResult
 * @property {{Array.<Movie>}} db     Movies from database   
 * @property {object} tmdb   Movies from the movie database
 * @property {object} omdb   Movies from OMDB

 */


/**
 * 
 * @typedef GenreCount 
 * @property {string} name   Genre name
 * @property {number} count   Genre count
 */


 /**
 * 
 * @typedef Count
 * @property {number} fb     Movies from facebook   
 * @property {number} tmdb   Movies from the movie database
 * @property {number} omdb   Movies from OMDB
*  @property {number} custom   Movies made in application
*  @property {number} total   Movies from OMDB
 */


 //////////////////////////////////////////////////////////////

// Import contact controller
var MovieController = require('../controllers/MovieController');


router.route('/genres/refresh')
  .get( MovieController.getTMDBGenres);

/**
 * This route will return all genres and number of movies in that genre
 * @route GET /movies/genres
 * @group Movies
 * @returns {Array.<GenreCount>} 200 - Genre count objects
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/genres')
  .get( MovieController.getGenreCount);



/**
 * This route will return movies by genre
 * @route GET /movies/genres/{genre}
 * @param {string} genre.param.required - Genre name
 * @group Movies
 * @returns {Array.<Movie>} 200 - Movies objects
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/genres/:genre')
  .get( MovieController.getGenre);


 /**
 * This route will add movie from tmdb to db
 * @route POST /movies/tmdb/{movie_id}
 * @param {string} movie_id.param.required - TMDB movie id
 * @group Movies
 * @returns {Movie.model} 200 - Movie object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/tmdb/:movie_id')
.post( MovieController.addTMDBMovie);


 /**
 * This route will return movies from TMDB that they recommend for you based on genres you liked
 * Field userLiked is 1 if user already liked this movie
 * @route GET /movies/recommend
 * @param {number} page.query.required - Page of The internet movie db
 * @group Movies
 * @returns {Array.<object>} 200 - Movies from 
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/recommend')
.get( MovieController.recomend);

/**
 * This route will add movie from omdb to db
 * @route POST /movies/omdb/{movie_id}
 * @param {string} movie_id.param.required - IMDB id got from OMDB searcha
 * @group Movies
 * @returns {Movie.model} 200 - Movie object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/omdb/:movie_id')
.post( MovieController.addOMDBMovie);



/**
 * This route will return movie count
 * @route GET /movies/count
 * @group Movies
 * @returns {Count.model} 200 - Number of movies
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/count')
.get( MovieController.count);



/**
 * This returns top 10 movies in Movie monster DB
 * @route GET /movies/db/top
 * @group Movies
 * @returns {Array.<MovieLeader>} 200 - Movies with count - number of users that liked it
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/db/top')
.get( MovieController.dbLeader);



/**
 * This returns top 10 movies in TMDB for today
 * @route GET /movies/tmdb/top
 * @group Movies
 * @returns {Array.<Movie>} 200 - Top movies
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/tmdb/top')
.get( MovieController.tmdbLeader);


/**
 * This route will return found movies from db, tmdb i omdb 
 * Field userLiked is 1 if user already liked this movie
 * @route GET /movies/search?term=blabla
 * @param {string} term.query.required - Search term 
 * @param {number} page_tmdb.query.required - Page of The internet movie db
 * @param {number} page_omdb.query.required - Page of omdb
 * @group Movies
 * @returns {SearchResult.model} 200 - Movie object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/search/')
  .get( MovieController.search);


/**
 * This route returns all movies in db
 * @route GET /movies
 * @group Movies
 * @returns {Array.<Movie>} 200 - Array of movie objects 
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will create new movie and add it to list of liked movies of user that created it
 * @route POST /movies
 * @param {CreateMovie.model} data.body.required - new movie
 * @group Movies
 * @returns {Movie.model} 201 - New movie
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  400 - Wrong form data
 * @headers {string} 200.Content-type - application/x-www-form-urlencoded
 * @produces application/json
 * @consumes application/json
*  @security JWT
 */
router.route('/')
  .get( MovieController.get)
  .post([
    check('name').isLength({ min: 3 }),
    check('description').isLength({ min: 4 }),
  ], MovieController.new);


 


/**
 * This route will return movie by id
 * @route GET /movies/{movie_id}
 * @param {string} movie_id.param.required - Movie id
 * @group Movies
 * @returns {Movie.model} 200 - Movie object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will return updated movie
 * @route PUT /movies/{movie_id}
 * @param {string} movie_id.param.required - User _id
 * @param {CreateMovie.model} data.body - Data for movie update
 * @group Movies
 * @returns {any} 200 - Changed user
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  400 - Wrong form data
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  403 - You can only update if you are admin
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will delete movie
 * @route DELETE /movies/{movie_id}
 * @param {string} movie_id.param.required - User _id
 * @group Movies
 * @returns {any} 204 - User deleted
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  403 - You can only delete movie if you are admin
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:movie_id')
  .get( MovieController.getById)
  .put( MovieController.update)
  .delete( MovieController.delete );





/**
 * This route will return users by movie id
 * @route GET /movies/{movie_id}/users
 * @param {string} movie_id.param.required - Movie id
 * @group Movies
 * @returns {Array.<User>} 200 - Array of users that like this movie
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:movie_id/users')
  .get( MovieController.getUsers)



/**
 * This route will add movie from db to user movies list
 * @route POST /movies/{movie_id}/users/{user_id}
 * @param {string} movie_id.param.required - Movie id
 * @param {string} movie_id.param.required - User id
 * @group Movies
 * @returns {User.model} 200 - User with added movie
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will remove movie to user movies list
 * @route DELETE /movies/{movie_id}/users/{user_id}
 * @param {string} movie_id.param.required - Movie id
 * @param {string} movie_id.param.required - User id
 * @group Movies
 * @returns {User.model} 200 - User with removed movie
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:movie_id/users/:user_id')
  .post( MovieController.addMovie)
  .delete( MovieController.removeMovie);








module.exports = router;
