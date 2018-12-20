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
 *  @property {Number} fan_count 
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
router.route('/:movie_id')
  .get( MovieController.getById);


module.exports = router;
