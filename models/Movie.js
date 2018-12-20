const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');


var movieSchema = mongoose.Schema({
      name: {
        type: String,
        required: false
      },
      cover: {
        type: {}
      },
      id : {
        type: String, 
        required: true,
        unique: true
      },
      genre: {
        type: {}
      }
      , release_date: {
        type: String,
        required: false
      }
      , directed_by: {
        type: String,
        required: false
      }
      , fan_count: {
        type: Number,
        required: false
      }, description: {
        type: String,
        required: false
      }
});
movieSchema.plugin(beautifyUnique);



var Movie = module.exports = mongoose.model('movie', movieSchema);
module.exports.get = function (callback, limit) {
    Movie.find(callback).limit(limit);
}