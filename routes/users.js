var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');



// Import contact controller
var UserController = require('../controllers/UserController');





router.route('/me')
  .get( UserController.me);


router.route('/')
    .get( UserController.get);


router.route('/:user_id')
    .get(UserController.getById);

module.exports = router;
