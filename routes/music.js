var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 /**
 * 
 * @typedef Music
 * @property {string} _id
 * @property {string} name
 * @property {string} genre
 * @property {string} bio 
 * @property {string} band_members
 * @property {string} id Format is <source>-Id of resource in source
 */


 //////////////////////////////////////////////////////////////

// Import contact controller
var MusicController = require('../controllers/MusicController');

/**
 * This route returns all music in db
 * @route GET /music
 * @group Music
 * @returns {Array.<Music>} 200 - Array of music objects 
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/')
  .get( MusicController.get);



/**
 * This route will return music by id
 * @route GET /music/{music_id}
 * @param {string} music_id.param.required - Music id
 * @group Music
 * @returns {Music.model} 200 - User object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:music_id')
  .get( MusicController.getById);


module.exports = router;
