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
 * @property {any} cover 
 * @property {Number} release_date Unix timestamp
 * @property {string} id Format is <source>-Id of resource in source
 * @property {string} directed_by
 *  @property {any} social_data 
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
router.route('/')
  .get( MovieController.get);



/**
 * This route will return music by id
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
 * @param {Movie.model} data.body - Data for movie update
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




module.exports = router;
