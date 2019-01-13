var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

var WeatherController = require('../controllers/WeatherController');

///////////////////////////////////////////////////////////////////////////////////////////////

 /**
 * 
 * @typedef Weather
 * @property {object} coord
 * @property {Array.<object>} weather 
 * @property {string} base 
 * @property {object} main 
 * @property {number} visibility
 * @property {object} wind
 * @property {object} clouds 
 * @property {number} dt 
 * @property {object} sys
 * @property {number} id
 * @property {string} name 
 * @property {number} code
 * @property {number} _id
 */

////////////////////////////////////////////////////////////////////////////////////////////


/**
 * This route return current weather in Zagreb
 * @route GET /weather
 * @group Weather
 * @returns {Weather.model} 200 - Weather object 
 * @returns {Error.model}  500 - Server error
 * @returns {Error.model}  401 - Invalid token
 * @returns {Error.model}  404 - No data found
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.route('/')
  .get( WeatherController.get)
  .post( WeatherController.create);

  module.exports = router;
