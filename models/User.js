const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');


var userSchema = mongoose.Schema({
      facebook_token: {
        type: String,
        required: false
      },
      facebook_id: {
        type: Number, unique: true, sparse: true
      },
      social : {
        type: Boolean, default: false
      },
      first_name: {
        type: String,
        required: false
      }
      , gender: {
        type: String,
        required: false
      }
      , last_name: {
        type: String,
        required: false
      }
      , birthday: {
        type: String,
        required: false
      }, email: {
        type: String,
        unique: 'Two users cannot share the same email ({VALUE})'
      },
      password : {
        type: String,
        required: true
      },
      movies : {
          type: [String]
      },
      music : {
        type: [String]
      }
});
userSchema.plugin(beautifyUnique);


userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}



var User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}