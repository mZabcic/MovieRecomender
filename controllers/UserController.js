const sget = require('simple-get')
User = require('../models/User');
var config = require('../config');
var blacklist = require('express-jwt-blacklist');

const { validationResult } = require('express-validator/check');


const returnUser = function(req, res) {
    User.findOne({_id: req.params.user_id}, function(err, doc) {
        if (err) {
          res.status(500).json(err);
          return;
        }
        if (!doc) {
          res.status(404).json({error : "No data found"});
          return;
        }
        res.json(doc);
      }); 
}

exports.get = function (req, res) {
  User.find({}, function(err, doc) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!doc) {
      res.status(404).json({error : "No data found"});
      return;
    }
    res.json(doc);
  }); 
};



exports.getById = function (req, res) {
    returnUser(req, res); 
};

exports.me = function(req, res) {
        req.params.user_id = req.user._id;
        returnUser(req, res); 
  
};


exports.delete = (req, res) => {
  var currentUserId = req.user._id;
  if (currentUserId != req.params.user_id) {
    return res.status(403).json({
      error: "You can only delete your account"
    });
  }
  User.deleteOne({ _id: req.params.user_id}, function(err, user) {
    if(!user) {
      return res.status(404).json({
          error: "No user found"
      });
  }
  if (err) {
    res.status(500).json(err);
    return;
  }
  blacklist.revoke(req.user)
  return res.status(204).json();
  
  });  
};


exports.update = (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          error: "No data in body"
      });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  var currentUserId = req.user._id;
  if (currentUserId != req.params.user_id) {
    return res.status(403).json({
      error: "You can only update your account"
    });
  }

  delete req.body.social;
  delete req.body.facbook_id;
  delete req.body.facebook_token;
  if (req.body.gender == '') {
    delete req.body.gender;
  }

 if (req.body.password != undefined && req.body.password.length < 4) {
    return res.status(400).json({error : "Password must be at least 4 charachters long"});
  } 

  if( req.body.birthday == undefined || req.body.birthday.length == 0) {
    delete req.body.birthday;
  }


  User.findByIdAndUpdate(
    currentUserId,
    req.body,
    { new: true
    },
    (err, user) => {
        if (err) return res.status(500).json({error : err});
        return res.send(user);
    }
)
};