const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var Schema = mongoose.Schema;


var weatherSchema = mongoose.Schema({
    "coord":{
        type: Object,
        required: false
      },
    "weather":{
        type: [Object],
        required: false
      },
    "base" : {
        type: String,
        required: false
      },
    "main": {
        type: Object,
        required: false
      },
    "visibility":{
        type: Number,
        required: false
      },
    "wind": {
        type: Object,
        required: false
      },
    "clouds": {
        type: Object,
        required: false
      },
    "dt": {
        type: Number,
        required: false
      },
    "sys": {
        type: Object,
        required: false
      },
    "id": {
        type: Number,
        required: false
      },
    "name": {
        type: String,
        required: false
      },
    "cod": {
        type: Number,
        required: false
      }

});
weatherSchema.plugin(beautifyUnique);



var Weather = module.exports = mongoose.model('weather', weatherSchema);
module.exports.get = function (callback, limit) {
    Weather.find(callback).limit(limit);
} 
