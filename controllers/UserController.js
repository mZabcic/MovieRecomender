const sget = require('simple-get')
User = require('../models/User');
var config = require('../config');
var blacklist = require('express-jwt-blacklist');
Movie = require('../models/Movie');

const { validationResult } = require('express-validator/check');


const returnUser = function(req, res) {
    User.findOne({_id: req.params.user_id}).populate(['movies', 'music'])
    .exec(function (err, movie) {
      if (err) return err;
  
      return res.json(movie);
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
  console.log(req.params.user_id)
    returnUser(req, res); 
};

exports.me = function(req, res) {
        req.params.user_id = req.user._id;
        returnUser(req, res); 
  
};


exports.delete = (req, res) => {
  var currentUserId = req.user._id;
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
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
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
    return res.status(403).json({
      error: "You can only update your account"
    });
  }

  delete req.body.social;
  delete req.body.facbook_id;
  delete req.body.facebook_token;
  delete req.body.role;
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






exports.refreshSocial = function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) return res.status(500).json({ error: 'Error on the server.' });
      
          refresh(user, res);

  });

}



const refresh = function(user, res) {
  
  sget.concat({
      url: 'https://graph.facebook.com/v3.1/me?fields=id,name,email,first_name,gender,last_name,birthday,movies{genre,name,cover,release_date,directed_by,fan_count,description},music{name,cover,genre,bio,band_members}',
      method: 'GET',
      headers: {
          Authorization: 'Bearer ' + user.facebook_token
      },
      json: true
  }, function (err, response, data) {
      if (data.error != undefined) {
          res.status(400).json(data);
          return
      }

      if (data.gender == 'male') {
          data.gender = 'M';
      } else {
          data.gender = 'F';
      }

      var allMusic = data.music.data;
      delete data.music;
      var movies_list = [];
      var movie_ids = [];
      data.movies.data.forEach(function (element) {
          element.source = "FB";
          element.id = 'FB-' + element.id;
          if (element.release_date != undefined) {
              var date = new Date(element.release_date*1000);
              var month = date.getMonth() + 1;
              element.release_date = month + '/' + date.getDate() + '/' + date.getFullYear();
          } else {
              element.release_date = "";
          }
          if (element.cover != undefined)
              element.cover = element.cover.source;
          else
              element.cover = "";
          if (element.genre != undefined) {
              var genres = [];
              genres = element.genre.split('/');
              element.genre = genres;
          } else {
              genre = "";
          }
          element.social_data = { "fb-fan-count": element.fan_count }
          movies_list.push(element);
          movie_ids.push(element.id);
      });
      Movie.find({ 'id': { $in: movie_ids } }, function (err, docs) {
          var existingMovies = [];
          docs.forEach((e) => {
              existingMovies.push(e._id);
              movies_list = movies_list.filter(el => el.id !== e.id);
          });
          if (movies_list.length == 0) {
              data.movies = existingMovies;

              var user = new User(data);

              user.save(function (err, docs) {
                  if (err) {
                      res.status(400).json(err);
                      return
                  }
                  console.log('New user');
                  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  var music_list = [];
                  var music_ids = [];
                  allMusic.forEach(function (element) {
                      element.id = 'FB-' + element.id;
                      if (element.cover != undefined)
                      element.cover = element.cover.source;
                      
                  else
                      element.cover = "";
                      if (element.genre != undefined) {
                          var genres = [];
                          genres = element.genre.split('/');
                          element.genre = genres;
                      } else {
                          genre = "";
                      }
                      music_list.push(element);
                      music_ids.push(element.id);
                  });
                  Music.find({ 'id': { $in: music_ids } }, function (err, music) {
                      var existingMusic = [];
                      music.forEach((e) => {
                          
                          existingMusic.push(e._id);
                          music_list = music_list.filter(el => el.id !== e.id);
                      });
                      if (music_list.length == 0) {
                          docs.music = existingMusic;

                          docs.save(function (err, use) {
                              if (err) {
                                  res.status(400).json(err);
                                  return
                              }
                              var token = jwt.sign({ _id: use._id, email: use.email, role: use.role, sub: use._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
                              res.status(201).json({
                                  token: token,
                                  user: use
                              });
                          })
                      } else {
                          Music.collection.insert(music_list, function (err, mus) {
                              if (err) {
                                  return res.json(err);
                              } else {
                                  var ids = [];
                                  mus.ops.forEach((e) => {
                                      ids.push(e._id);
                                  })

                                  docs.music = ids.concat(existingMusic);


                                  docs.save(function (err, use) {
                                      if (err) {
                                          res.status(400).json(err);
                                          return
                                      }
                                      console.log('New user');
                                      var token = jwt.sign({ _id: use._id, email: use.email, role: use.role, sub: use._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
                                      res.status(201).json({
                                          token: token,
                                          user: use
                                      });
                                  })
                              }
                          });
                      }
                  }) 
                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              })
          } else
              Movie.collection.insert(movies_list, function (err, docs) {
                  if (err) {
                      return res.json(err);
                  } else {
                      var ids = [];
                      docs.ops.forEach((e) => {
                          ids.push(e._id);
                      })

                      data.movies = ids.concat(existingMovies);

                      var user = new User(data);

                      user.save(function (err, docs) {
                          if (err) {
                              res.status(400).json(err);
                              return
                          }


                          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          var music_list = [];
                          var music_ids = [];
                          allMusic.forEach(function (element) {
                              element.id = 'FB-' + element.id;
                              if (element.cover != undefined)
                              element.cover = element.cover.source;
                          else
                              element.cover = "";
                              if (element.genre != undefined) {
                                  var genres = [];
                                  genres = element.genre.split('/');
                                  element.genre = genres;
                              } else {
                                  genre = "";
                              }
                              music_list.push(element);
                              music_ids.push(element.id);
                          });
                          Music.find({ 'id': { $in: music_ids } }, function (err, music) {
                              var existingMusic = [];
                              music.forEach((e) => {
                                  existingMusic.push(e._id);
                                  music_list = music_list.filter(el => el.id !== e.id);
                              });
                              if (music_list.length == 0) {
                                  docs.music = existingMusic;

                                  docs.save(function (err, use) {
                                      if (err) {
                                          res.status(400).json(err);
                                          return
                                      }
                                      console.log('New user');
                                      var token = jwt.sign({ _id: use._id, email: use.email, role: use.role, sub: use._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
                                      res.status(201).json({
                                          token: token,
                                          user: use
                                      });
                                  })
                              } else {
                                  Music.collection.insert(music_list, function (err, mus) {
                                      if (err) {
                                          return console.error(err);
                                      } else {
                                          var ids = [];
                                          mus.ops.forEach((e) => {
                                              ids.push(e._id);
                                          })

                                          docs.music = ids.concat(existingMusic);


                                          docs.save(function (err, use) {
                                              if (err) {
                                                  res.status(400).json(err);
                                                  return
                                              }
                                              var token = jwt.sign({ _id: use._id, email: use.email, role: use.role, sub: use._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
                                              res.status(201).json({
                                                  token: token,
                                                  user: use
                                              });
                                          })
                                      }
                                  });
                              }
                          })
                          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      })
                  }
              });
      })

  })
}














