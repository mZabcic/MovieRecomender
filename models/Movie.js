const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var Schema = mongoose.Schema;


var movieSchema = mongoose.Schema({
      name: {
        type: String,
        required: false
      },
      cover: {
        type: String
      },
      id : {
        type: String, 
        required: true,
        unique: true
      },
      genre: {
        type: [String]
      }
      , release_date: {
        type: String,
        required: false
      }
      , directed_by: {
        type: String,
        required: false
      }
      , social_data: {
        type: {},
        required: false
      }, description: {
        type: String,
        required: false
      },
      users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      source: {
        type: String,
        required: true
      },
      userLiked : {
        type: Number,
        required: false
      },
      link : {
        type: String,
        required: false
      }
});
movieSchema.plugin(beautifyUnique);



var Movie = module.exports = mongoose.model('movie', movieSchema);
module.exports.get = function (callback, limit) {
    Movie.find(callback).limit(limit);
}
