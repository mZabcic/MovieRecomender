
Movie = require('../models/Movie');
User = require('../models/User');
Genre = require('../models/Genre');
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



exports.get = function (req, res) {
  User.findOne({_id: req.user._id}).populate(['movies'])
    .exec(function (err, u) {
  Movie.find({}, function(err, doc) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!doc) {
      res.status(404).json({error : "No data found"});
      return;
    }
    doc.forEach((e) => {
      e.userLiked = checkIfUserLikedMovie(u, e.id) ? 1 : 0;
    })
    res.json(doc);
  }); 
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
  req.body.source = "CUSTOM"
  var movie = new Movie(req.body);
  movie.save(function (err, docs) {
      if (err) {
          res.status(400).json(err);
          return
      }
      console.log('New movie');
      


    User.findOne({_id : req.user._id}, (err, doc) => {
      if (doc.movies.indexOf(docs._id) < 0) {
        doc.movies.push(docs._id);
        doc.save();
      }
      return res.status(201).send(docs);
  })
      
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
  var page_tmdb = req.query.tmdb_page;
  var page_omdb = req.query.omdb_page;
  var returnObject = {};
  page_tmdb = page_tmdb == undefined ? 1 : page_tmdb;
  page_omdb = page_omdb == undefined ? 1 : page_omdb;
 if (term == undefined) {
    res.status(400).json({error : "Term must be provided"});
  } 
  if (term.length < 3) {
    res.status(400).json({error : "Term must be at least 3 char long"});
  }
  User.findOne({_id: req.user._id}).populate(['movies'])
    .exec(function (err, u) {
  Movie
  .find({ "name": { "$regex":  term , "$options": "i" }})
  .sort({'name': 1})
  .exec(function(err, docs) {
    docs.forEach((e) => {
      e.userLiked = checkIfUserLikedMovie(u, e.id) ? 1 : 0;
    })
      returnObject.db = docs;
      tmdbSearch(term, returnObject, page_tmdb, res, page_omdb, u);
  });
});
}



const tmdbSearch = (term, returnObject, page, res, page_omdb, u) => {
  sget.concat({
    url: config.moviedb_url + 'search/movie' + config.moviedb_apikey + '&query=' + term + '&page=' + page,
    method: 'GET',
    json: true
}, function (err, response, data) {
  Genre.find({}, (err, ge) => {
 
    data.results.forEach((e) => {
      var mg = [];
    if (e.genre_ids != undefined)
    e.genre_ids.forEach((g) => {
      var obj = ge.find(obj => obj.id == g);
      if (obj != undefined)
      mg.push(obj.name);
    })
    e.genre = mg;
      e.poster_path = 'https://image.tmdb.org/t/p/w500' + e.poster_path;
      var newId = "tmdb-" + e.id;
      e.userLiked = checkIfUserLikedMovie(u, newId) ? 1 : 0;
    })
    returnObject.tmdb = data;
    omdbSearch(term, returnObject, page_omdb, res, u);
  });
});
}


const omdbSearch = (term, returnObject, page, res, u) => {
  sget.concat({
    url: config.omdb_url  + config.omdb_apikey + '&s=' + term + '&page=' + page + '&type=movie',
    method: 'GET',
    json: true
}, function (err, response, data) {
  data.Search.forEach((e) => {
    var newId = "omdb-" + e.imdbID; 
    e.userLiked = checkIfUserLikedMovie(u, newId) ? 1 : 0;
  })
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
      if (data.id == undefined) {
        return res.status(400).json({error : "Movie doesnt exist"});
      }
     
      var g = [];
      if (data.genres != undefined)
         data.genres.forEach(e => {
            g.push(e.name);
         });
         for (var i = 0; i < g.length; i++) {
          g[i] = g[i].trim();
        }
        var imdbLink = "";
        if (data.imdb_id != undefined) {
          imdbLink = 'https://www.imdb.com/title/' + data.imdb_id
        }
         var date = new Date(data.release_date);
         var month = date.getMonth() + 1;
          data.release_date = month + '/' + date.getDate() + '/' + date.getFullYear();
        var movie = {
          name : data.title,
          cover : 'https://image.tmdb.org/t/p/w500' + data.poster_path,
          id : 'tmdb-' + data.id,
          genre : g,
          release_date : data.release_date,
          description : data.overview,
          social_data : {
            "tmdb_vote_average": data.vote_average,
            "tmdb_vote_count": data.vote_count
          },
          source : "TMDB",
          link : imdbLink
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
        url: config.omdb_url + config.omdb_apikey + '&i=' + req.params.movie_id + '&plot=full',
        method: 'GET',
        json: true
    }, function (err, response, data) {
      if (data.imdbID == undefined) {
        return res.status(400).json({error : "Movie doesnt exist"});
      }
      var g = [];
      g = data.Genre.split(',');
      for (var i = 0; i < g.length; i++) {
        g[i] = g[i].trim();
      }
      var date = new Date(data.Released);
      var month = date.getMonth() + 1;
      var imdbLink = "";
      if (data.imdbID != undefined) {
        imdbLink = 'https://www.imdb.com/title/' + data.imdbID
      }
      data.Released = month + '/' + date.getDate() + '/' + date.getFullYear();
        var movie = {
          name : data.Title,
          cover : data.Poster,
          id : gId,
          genre : g,
          release_date : data.Released,
          description : data.Plot,
          social_data : {
            "omdb_rating": data.imdbRating,
            "omdb_vote_count": data.imdbVotes
          },
          source : "OMDB",
          directed_by : data.Director,
          link : imdbLink
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


exports.count = (req, res) => {
  var object = {};
  Movie.count({source : "FB"}, (err, fb) => {
    object.fb = fb;
    Movie.count({source : "CUSTOM"}, (err, custom) => {
      object.custom = custom;
      Movie.count({source : "OMDB"}, (err, omdb) => {
        object.omdb = omdb;
        Movie.count({source : "TMDB"}, (err, tmdb) => {
          object.tmdb = tmdb;
          object.total = fb+custom+omdb+tmdb;
          res.json(object);
        })
      })
      
    })
  })
}



exports.recomend = (req, res) => {
  var page = req.query.page == undefined ? 1 : req.query.page;
  User.findOne({_id: req.user._id}).populate(['movies'])
    .exec(function (err, u) {
      if (err) return err;
      var genres = makeGenreLeader(u);
      if (genres < 3) {
        res.status(404).json({error : "Too few films from The Movie Database source for recomending, add some more"});
      }
      //Uzmi top 3 žanra
      genres = genres.slice(0, 3);
      var movies = makeMovieLeader(u, genres);
      if (movies.length == 0) {
        res.status(404).json({error : "Too few films from The Movie Database source for recomending, add some more"});
      }
      var movie_id = movies[0].id;
      movie_id = movie_id.replace('tmdb-', '');
      sget.concat({
        url: config.moviedb_url + 'movie/' + movie_id + '/recommendations' + config.moviedb_apikey + '&page=' + page ,
        method: 'GET',
        json: true
    }, function (err, response, data) {
      data.results.forEach((e) => {
        e.poster_path = 'https://image.tmdb.org/t/p/w500' + e.poster_path;
        var newId = "tmdb-" + e.id;
        e.userLiked = checkIfUserLikedMovie(u, newId) ? 1 : 0;
        
      })
      return res.json(data);
    })

      
  });
}



const makeGenreLeader = (u) => {
  var genres = {};
  u.movies.forEach((e) => {
    e.genre.forEach((g) => {
      if(typeof(genres[g]) === "undefined"){
        genres[g] = 1;
    }else{
      genres[g] = genres[g] + 1;
    }
    })
  })
  var genreArray = [];
  for (var property in genres) {
    if (genres.hasOwnProperty(property)) {
      genreArray.push({name : property, count : genres[property]});
    }
  }

  var compare = (a,b) => {
    if (a.count < b.count)
      return 1;
    if (a.count > b.count)
      return -1;
    return 0;
  }

  genreArray.sort(compare);

  return genreArray;
}


const makeMovieLeader = (u, genres) => {
  var genreCompare = [];
  genres.forEach((e) => {
    genreCompare.push(e.name);
  }
  )
  var movies = {};
  var count = 0;
  u.movies.forEach((e) => {
    if (e.source != "TMDB" ) {
      return;
    }
    e.genre.forEach((g) => {
    if (genreCompare.indexOf(g) > 0) {
      if(typeof(movies[e.id]) === "undefined"){
        movies[e.id] = 1;
      }else{
        movies[e.id] = movies[e.id] + 1;
      }
      } 
    })
  })
  var movieArray = [];
  for (var property in movies) {
    if (movies.hasOwnProperty(property)) {
      movieArray.push({id : property, count : movies[property]});
    }
  }

  var compare = (a,b) => {
    if (a.count < b.count)
      return 1;
    if (a.count > b.count)
      return -1;
    return 0;
  }

  movieArray.sort(compare);

  return movieArray;
}


const checkIfUserLikedMovie = (u, id) => {
 
  var check = u.movies.filter(el => el.id === id);
  return check.length == 0 ? false : true;
}




exports.getGenre = function (req, res) {
  var genre_name = req.params.genre.toLowerCase();
  genre_name =  genre_name.charAt(0).toUpperCase() +  genre_name.slice(1);
 
  Movie.find({genre : genre_name}, function(err, doc) {
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


exports.getGenreCount = function (req, res) {
 
  Movie.find({}, function(err, doc) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!doc) {
      res.status(404).json({error : "No data found"});
      return;
    }
    var genres = {};
  doc.forEach((e) => {
    e.genre.forEach((g) => {
      if(typeof(genres[g]) === "undefined"){
        genres[g] = 1;
    }else{
      genres[g] = genres[g] + 1;
    }
    })
  })
  var genreArray = [];
  for (var property in genres) {
    if (genres.hasOwnProperty(property)) {
      genreArray.push({name : property, count : genres[property]});
    }
  }

  var compare = (a,b) => {
    if (a.count < b.count)
      return 1;
    if (a.count > b.count)
      return -1;
    return 0;
  }

  genreArray.sort(compare);
  res.json(genreArray);
  }); 
};

exports.dbLeader = (req, res) => {
  var allMovies = [];
  var allMoviesIds = [];
  User.find().populate(['movies'])
  .exec(function (err, movie) {
    movie.forEach((e) => {
      e.movies.forEach((m) => {
         allMoviesIds.push(m._id);
         if (allMovies.indexOf(m) < 0) {
           allMovies.push(m);
         }
      })
    })
  var leader = makeMoviesLeader(allMoviesIds);
  leader = leader.slice(0, 10);
  var returnObject = [];
  leader.forEach((e) => {
    var obj = allMovies.find(obj => obj._id == e.name);
    obj.usersLiked = e.count;
    returnObject.push(obj);

  })
  res.json(returnObject);
  })
}

const makeMoviesLeader = (m) => {
  var movies = {};
  m.forEach((e) => {
      if(typeof(movies[e]) === "undefined"){
        movies[e] = 1;
    }else{
      movies[e] = movies[e] + 1;
    }
  })
  var moviesArray = [];
  for (var property in movies) {
    if (movies.hasOwnProperty(property)) {
      moviesArray.push({name : property, count : movies[property]});
    }
  }

  var compare = (a,b) => {
    if (a.count < b.count)
      return 1;
    if (a.count > b.count)
      return -1;
    return 0;
  }

  moviesArray.sort(compare);

  return moviesArray;
}


exports.tmdbLeader = function (req, res) {
  User.findOne({_id: req.user._id}).populate(['movies'])
  .exec(function (err, u) {
  sget.concat({
    url: config.moviedb_url + 'movie/popular' + config.moviedb_apikey + '&page=1',
    method: 'GET',
    json: true
}, function (err, response, data) {
  Genre.find({}, (err, ge) => {

  var returnObject = [];
  data.results.forEach((e) => {
    var mg = [];
    if (e.genre_ids != undefined)
    e.genre_ids.forEach((g) => {
      var obj = ge.find(obj => obj.id == g);
      if (obj != undefined)
      mg.push(obj.name);
    })
    e.genre = mg;
    e.poster_path = 'https://image.tmdb.org/t/p/w500' + e.poster_path;
    var newId = "tmdb-" + e.id;
    e.userLiked = checkIfUserLikedMovie(u, newId) ? 1 : 0;
    var date = new Date(e.release_date);
    var month = date.getMonth() + 1;
    e.release_date = month + '/' + date.getDate() + '/' + date.getFullYear();
    returnObject.push(e);
  })
  res.json(returnObject);
})
})
})
}


exports.getTMDBGenres = (req, res) => {
  sget.concat({
    url: config.moviedb_url + 'genre/movie/list' + config.moviedb_apikey,
    method: 'GET',
    json: true
}, function (err, response, data) {
  var allGenres = [];
  data.genres.forEach(e => {
    var g = new Genre(e);
    allGenres.push(g);
  })
  Genre.collection.insert(allGenres, function (err, docs) {
    res.json(docs);
  });
});
}

