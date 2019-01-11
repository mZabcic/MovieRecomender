
Movie = require('../models/Movie');
User = require('../models/User');
var config = require('../config');
const sget = require('simple-get')

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

const getSocialData = function(name) {

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



exports.search = function (req, res)  {
  var term = req.query.term;
  var page = req.query.page;
  var page_tmdb = req.query.tmdb_page;
  var page_omdb = req.query.omdb_page;
  var returnObject = {};
  page = page == undefined ? 1 : page;
  page_tmdb = page_tmdb == undefined ? 1 : page_tmdb;
  page_omdb = page_omdb == undefined ? 1 : page_omdb;
 if (term == undefined) {
    res.status(400).json({error : "Term must be provided"});
  } 
  if (term.length < 3) {
    res.status(400).json({error : "Term must be at least 3 char long"});
  }
  Movie
  .find({ "name": { "$regex":  term , "$options": "i" }})
  .sort({'name': 1})
  .exec(function(err, docs) {
      returnObject.db = docs;
      tmdbSearch(term, returnObject, page_tmdb, res, page_omdb);
  });
}



const tmdbSearch = (term, returnObject, page, res, page_omdb) => {
  sget.concat({
    url: config.moviedb_url + 'search/movie' + config.moviedb_apikey + '&query=' + term + '&page' + page,
    method: 'GET',
    json: true
}, function (err, response, data) {
    returnObject.tmdb = data;
    omdbSearch(term, returnObject, page_omdb, res);
});
}


const omdbSearch = (term, returnObject, page, res) => {
  sget.concat({
    url: config.omdb_url  + config.omdb_apikey + '&s=' + term + '&page=' + page + '&type=movie',
    method: 'GET',
    json: true
}, function (err, response, data) {
    returnObject.omdb = data;
    res.json(returnObject);
    
});
}




exports.addTMDBMovie = (req, res) => {
  var gId = 'tmdb-' + req.params.movie_id;
  Movie.findOne({id : gId},function(err,m){
    if (!err && m){
        
      User.findOne({_id : req.user._id}, (err, doc) => {
        if (doc.movies.indexOf(m._id) < 0) {
          doc.movies.push(m._id);
          doc.save();
        }
        res.json(m);
    })
    } else {

      sget.concat({
        url: config.moviedb_url + 'movie/' + req.params.movie_id + config.moviedb_apikey,
        method: 'GET',
        json: true
    }, function (err, response, data) {
      var g = [];
         data.genres.forEach(e => {
            g.push(e.name);
         });
        var movie = {
          name : data.title,
          cover : 'https://image.tmdb.org/t/p/w500' + data.poster_path,
          id : 'tmdb-' + data.id,
          genre : g,
          release_date : data.release_date,
          description : data.overview,
          social_data : {
            "tmdb-vote_average": data.vote_average,
            "tmdb-vote_count": data.vote_count
          }
        };
        Movie.create(movie, function (err, small) {
          if (err) return  res.json(err);;
          User.findOne({_id : req.user._id}, (err, doc) => {
            if (doc.movies.indexOf(small._id) < 0) {
              doc.movies.push(small._id);
              doc.save();
            }
            res.json(small);
        })
          })
        
    
    });

    } 
 });
  
}


exports.addOMDBMovie = (req, res) => {
  var gId = 'omdb-' + req.params.movie_id;
  Movie.findOne({id : gId},function(err,m){
    if (!err && m){
        
      User.findOne({_id : req.user._id}, (err, doc) => {
        if (doc.movies.indexOf(m._id) < 0) {
          doc.movies.push(m._id);
          doc.save();
        }
        return res.json(m);
    })
    } else {

      sget.concat({
        url: config.moviedb_url + 'movie/' + req.params.movie_id + config.moviedb_apikey,
        method: 'GET',
        json: true
    }, function (err, response, data) {
      var g = [];
         data.genres.forEach(e => {
            g.push(e.name);
         });
        var movie = {
          name : data.title,
          cover : 'https://image.tmdb.org/t/p/w500' + data.poster_path,
          id : 'tmdb-' + data.id,
          genre : g,
          release_date : data.release_date,
          description : data.overview,
          social_data : {
            "tmdb-vote_average": data.vote_average,
            "tmdb-vote_count": data.vote_count
          }
        };
        Movie.create(movie, function (err, small) {
          if (err) return  res.json(err);;
          User.findOne({_id : req.user._id}, (err, doc) => {
            if (doc.movies.indexOf(small._id) < 0) {
              doc.movies.push(small._id);
              doc.save();
            }
            res.json(small);
        })
          })
        
    
    });

    } 
 });
  
}


