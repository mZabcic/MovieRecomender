
Movie = require('../models/Movie');
User = require('../models/User');

const { validationResult } = require('express-validator/check');

const returnMovie = function(req, res) {
    Movie.findOne({ _id: req.params.movie_id}, function(err, doc) {
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
  Movie.find({}, function(err, doc) {
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
    returnMovie(req, res); 
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



  if (req.user.role != "Admin") {
    return res.status(403).json({
      error: "You can only update movie data if you are admin"
    });
  }

  delete req.body.social_data;
 

 


  Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    { new: true
    },
    (err, movie) => {
        if (err) return res.status(500).json({error : err});
        return res.send(movie);
    }
)
  }


exports.delete = (req, res) => {
  if (req.user.role != "Admin") {
    return res.status(403).json({
      error: "You can only update movie data if you are admin"
    });
  }
  Movie.deleteOne({ _id: req.params.movie_id}, function(err, movie) {
    if(!movie) {
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
