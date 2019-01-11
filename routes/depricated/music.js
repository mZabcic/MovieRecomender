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
 *   @property {any} social_data 
 * @property {string} id Format is <source>-Id of resource in source
 */


  /**
 * 
 * @typedef CreateMusic
 * @property {string} name
 * @property {string} genre
 * @property {string} bio 
 * @property {string} band_members
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
/**
 * This route will create new music and add it to list of liked music of user that created it
 * @route POST /music
 * @param {CreateMusic.model} data.body.required - new music
 * @group Music
 * @returns {Music.model} 201 - New music
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  400 - Wrong form data
 * @headers {string} 200.Content-type - application/x-www-form-urlencoded
 * @produces application/json
 * @consumes application/json
*  @security JWT
 */
router.route('/')
  .get( MusicController.get)
  .post([
    check('name').isLength({ min: 3 })
  ], MusicController.new);



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
/**
 * This route will return updated music
 * @route PUT /music/{music_id}
 * @param {string} music_id.param.required - Music _id
 * @param {Music.model} data.body - Data for music update
 * @group Music
 * @returns {any} 200 - Changed music
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
 * This route will delete music
 * @route DELETE /music/{music_id}
 * @param {string} music_id.param.required - Music _id
 * @group Music
 * @returns {any} 204 - Music deleted
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  403 - You can only delete music if you are admin
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:music_id')
  .get( MusicController.getById)
  .put( MusicController.update)
  .delete( MusicController.delete );



/**
 * This route will return users by music id
 * @route GET /music/{music_id}/users
 * @param {string} music_id.param.required - Music id
 * @group Music
 * @returns {Array.<User>} 200 - Array of users that like this music
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:music_id/users')
  .get( MusicController.getUsers)



/**
 * This route will add music to user music list
 * @route POST /music/{music_id}/users/{user_id}
 * @param {string} music_id.param.required - Music id
 * @param {string} music_id.param.required - User id
 * @group Music
 * @returns {User.model} 200 - User with added music
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will remove music from user music list
 * @route DELETE /music/{music_id}/users/{user_id}
 * @param {string} music_id.param.required - music id
 * @param {string} music_id.param.required - music id
 * @group Music
 * @returns {User.model} 200 - User with removed music
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:music_id/users/:user_id')
  .post( MusicController.addMusic)
  .delete( MusicController.removeMusic);



module.exports = router;
