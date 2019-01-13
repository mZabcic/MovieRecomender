const mongoose = require('mongoose');



var genresSchema = mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      id : {
        type: Number, 
        required: true,
        unique: true
      }
});



var Genre = module.exports = mongoose.model('genre', genresSchema);
module.exports.get = function (callback, limit) {
    Genre.find(callback).limit(limit);
}
