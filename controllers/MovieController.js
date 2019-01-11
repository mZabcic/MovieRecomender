
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


exports.new = function (req, res) {
  const errors = validationResult(req);
  console.log(req.user._id);
  if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
  }
  if (req.body.genre != undefined) {
    req.body.genre = req.body.genre.split(',');
  }
  delete req.body.social_data; 
  req.body.id = "CUSTOM-" + new Date().valueOf();
  var movie = new Movie(req.body);
  movie.save(function (err, docs) {
      if (err) {
          res.status(400).json(err);
          return
      }
      console.log('New movie');
      User.findById(
        req.user._id,
        (err, user) => {
            if (err) return res.status(500).json({error : err});
            user.movies.push(docs._id);
            user.save();
            return res.status(201).send(docs);
        }
    )
      
  })
};



exports.getUsers = function (req, res) {
  User.find({movies : req.params.movie_id}, function(err, doc) {
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


exports.addMovie = function (req, res) {
  var currentUserId = req.user._id;
  
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
    return res.status(403).json({
      error: "You can only add movie to your account"
    });
  }


  Movie.findOne({ _id: req.params.movie_id}, function(err, doc) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!doc) {
      res.status(404).json({error : "No data found"});
      return;
    }
    User.findOne({ _id: req.params.user_id}, function(err, docs) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      if (!docs) {
        res.status(404).json({error : "No data found"});
        return;
      }
      docs.movies.push(doc._id);
      docs.save();
      res.json(docs);
    } ); 
  }); 
  

};


exports.removeMovie = function (req, res) {
  var currentUserId = req.user._id;
  
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
    return res.status(403).json({
      error: "You can only remove movie from your account"
    });
  }

    User.findOne({ _id: req.params.user_id}, function(err, docs) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      if (!docs) {
        res.status(404).json({error : "No data found"});
        return;
      }
      docs.movies.splice(docs.movies.indexOf(req.params.movie_id), 1);
      docs.save();
      res.json(docs);
    } ); 
  

};