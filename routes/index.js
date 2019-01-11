var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 /**
 * 
 * @typedef AuthData
 * @property {string} access_token.required  Email address, must be unique
 * @property {string} facebook_id.required Password, must be at least 4 char long
 * 
 */



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import contact controller
var AuthController = require('../controllers/AuthController');

/*
router.route('/register')
    .post([
      check('email').isLength({ min: 3 }),
      check('password').isLength({ min: 4 }),
    ], AuthController.new);




router.route('/social-register')
  .post([
    check('password').isLength({ min: 4 }),
    check('access_token').isLength({ min: 1 }),
], AuthController.newSocial);
*/


/**
 * This route will return user his token and object that represents him
 * @route POST /login
 * @param {AuthData.model} data.body.required - Data for login
 * @group Auth
 * @returns {UserAuth.model} 200 - User object and JWT token
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  400 - Wrong form data
 * @returns {Error.model}  404 - No user found
 * @headers {string} 200.Content-type - application/x-www-form-urlencoded
 * @produces application/json
 * @consumes application/json
 */
router.route('/login')
  .post([
    check('facebook_id').isLength({ min: 1 }),
    check('access_token').isLength({ min: 1 }),
], AuthController.login);



module.exports = router;
