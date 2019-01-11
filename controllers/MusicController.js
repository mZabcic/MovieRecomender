
Music = require('../models/Music');

const { validationResult } = require('express-validator/check');

const returnMusic = function(req, res) {
  console.log(req.params.music_id)
    Music.findOne({ _id: req.params.music_id}, function(err, doc) {
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
  Music.find({}, function(err, doc) {
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
    returnMusic(req, res); 
};

exports.update = (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          error: "No data in body"
      });
  }




  if (req.user.role != "Admin") {
    return res.status(403).json({
      error: "You can only update music data if you are admin"
    });
  }

 

 


  Music.findByIdAndUpdate(
    req.params.music_id,
    req.body,
    { new: true
    },
    (err, music) => {
        if (err) return res.status(500).json({error : err});
        return res.send(music);
    }
)
  }


exports.delete = (req, res) => {
  if (req.user.role != "Admin") {
    return res.status(403).json({
      error: "You can only update movie data if you are admin"
    });
  }
  Music.deleteOne({ _id: req.params.music_id}, function(err, music) {
    if(!music) {
      return res.status(404).json({
          error: "No user found"
      });
  }
  if (err) {
    res.status(500).json(err);
    return;
  }
  return res.status(204).json();
  
  
  });  
};


