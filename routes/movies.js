var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 /**
 * 
 * @typedef Movie
 * @property {string} _id
 * @property {string} name
 * @property {string} genre
 * @property {string} cover 
 * @property {Number} release_date Unix timestamp
 * @property {string} id Format is <source>-Id of resource in source
 * @property {string} directed_by
 *  @property {any} social_data 
 * @property {string} description
 */


 /**
 * 
 * @typedef CreateMovie
 * @property {string} name
 * @property {string} genre
 * @property {string} cover 
 * @property {Number} release_date Unix timestamp
 * @property {string} directed_by
 * @property {string} description
 */


 //////////////////////////////////////////////////////////////

// Import contact controller
var MovieController = require('../controllers/MovieController');

/**
 * This route returns all movies in db
 * @route GET /movie
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
 * @route POST /movie
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
 * @route GET /movie/{movie_id}
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
 * @route GET /movie/{movie_id}/users
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
 * This route will add movie to user movies list
 * @route POST /movie/{movie_id}/users/{user_id}
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
 * @route DELETE /movie/{movie_id}/users/{user_id}
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
