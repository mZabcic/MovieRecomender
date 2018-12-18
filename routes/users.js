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


router.route('/me')
  .get( UserController.me);


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
