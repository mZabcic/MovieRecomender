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


  const password = function password(value) {
    
    if (value == undefined || value.length == 0) return true;
    if (!value.length > 0) return false;
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
 * @typedef UserUpdate
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} gender
 * @property {string} birthday Format MM/DD/YY
 * @property {string} movies
 * @property {string} password Min 4 char
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
 * @produces application/json
 * @consumes application/json
 * @security JWT
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
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('')
    .get( UserController.get);



    /**
 * This route will retur users in system
 * @route GET /users/{user_id}
 * @param {string} user_id.param.required - User _id
 * @group Users
 * @returns {User.model} 200 - User object
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will return array of all users in system
 * @route DELETE /users/{user_id}
 * @param {string} user_id.param.required - User _id
 * @group Users
 * @returns {User.model} 204 - User deleted
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  403 - You can only delete your account
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
/**
 * This route will return array of all users in system
 * @route PUT /users/{user_id}
 * @param {string} user_id.param.required - User _id
 * @param {UserUpdate.model} data.body - Data for user update
 * @group Users
 * @returns {User.model} 200 - Changed user
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  400 - Wrong form data
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  403 - You can only delete your account
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/:user_id')
    .get(UserController.getById)
    
    .delete(UserController.delete)
    .put([
      check('birthday').custom(date).withMessage('The date format must be MM/DD/YY'),
      check('password').custom(password).withMessage('Password must be at least 4 char long'),
      check('gender').isIn(['M', 'F', ''])
    ], 
        UserController.update);

module.exports = router;
