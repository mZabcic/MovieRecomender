const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var Schema = mongoose.Schema;

var musicSchema = mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      genre: {
        type: String,
        required: true
      },
      id : {
        type: String, 
        required: true,
        unique: true
      },
      bio: {
        type: String,
        required: false
      }
      , band_members: {
        type: String,
        required: false
      },
      users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});
musicSchema.plugin(beautifyUnique);



var Music = module.exports = mongoose.model('music', musicSchema);
module.exports.get = function (callback, limit) {
    Music.find(callback).limit(limit);
}