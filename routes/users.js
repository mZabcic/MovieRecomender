var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');



// Import contact controller
var UserController = require('../controllers/UserController');


const date = function isValidDate(value) {
    
    if (value == undefined || value.length == 0) return true;
    if (!value.match(/(\d{2})\/(\d{2})\/(\d{2})/)) return false;
    const date = new Date(value);
    if (!date.getTime()) return false;
    return true;
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @typedef User
 * @property {string} _id.required  Main id of object
 * @property {string} email.required Unique identifier
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} gender
 * @property {string} birthday Format MM/DD/YY
 * @property {string} movies
 * @property {string} facebook_token Access token for facebook
 * @property {string} facebook_id ID of user on facebook
 * @property {boolean} social.required  If user is connected to social network
 * 
 */

 /**
 * 
 * @typedef Error
 * @property {string} error.required Error message
 * 
 */


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * This route return current user by JWT
 * @route GET /users/me
 * @group Users
 * @returns {User.model} 200 - User object parsed from token
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @headers {string} 200.authorization - Bearer <jwt token>
 * @produces application/json
 * @consumes application/json
 */
router.route('/me')
  .get( UserController.me);


/**
 * This route will return array of all users in system
 * @route GET /users
 * @group Users
 * @returns {Array.<User>} 200 - Array of user object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @headers {string} 200.authorization - Bearer <jwt token>
 * @produces application/json
 * @consumes application/json
 */
router.route('')
    .get( UserController.get);


router.route('/:user_id')
    .get(UserController.getById)
    .delete(UserController.delete)
    .put([
      check('birthday').custom(date).withMessage('The date format must be MM/DD/YY'),
      check('gender').isIn(['M', 'F', ''])
    ], 
        UserController.update);

module.exports = router;
