var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');



// Import contact controller
var AuthController = require('../controllers/AuthController');


router.route('/register')
    .post([
      check('email').isLength({ min: 3 }),
      check('password').isLength({ min: 4 }),
    ], AuthController.new);

router.route('/social-register')
  .post([
    check('password').isLength({ min: 4 }),
    check('authToken').isLength({ min: 1 }),
], AuthController.newSocial);

router.route('/login')
  .post([
    check('password').isLength({ min: 4 }),
    check('email').isLength({ min: 1 }),
], AuthController.login);



module.exports = router;
