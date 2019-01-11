
Music = require('../models/Music');

const { validationResult } = require('express-validator/check');

const returnMusic = function(req, res) {
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
      error: "You can only update music data if you are admin"
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
  var music = new Music(req.body);
  music.save(function (err, docs) {
      if (err) {
          res.status(400).json(err);
          return
      }
      console.log('New music');
      User.findById(
        req.user._id,
        (err, user) => {
            if (err) return res.status(500).json({error : err});
            user.music.push(docs._id);
            user.save();
            return res.status(201).send(docs);
        }
    )
      
  })
};


exports.getUsers = function (req, res) {
  User.find({music : req.params.music_id}, function(err, doc) {
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


exports.addMusic = function (req, res) {
  var currentUserId = req.user._id;
  
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
    return res.status(403).json({
      error: "You can only add music to your account"
    });
  }


  Music.findOne({ _id: req.params.music_id}, function(err, doc) {
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
      docs.music.push(doc._id);
      docs.save();
      res.json(docs);
    } ); 
  }); 
  

};


exports.removeMusic = function (req, res) {
  var currentUserId = req.user._id;
  
  if (currentUserId != req.params.user_id && req.user.role != 'Admin') {
    return res.status(403).json({
      error: "You can only remove music from your account"
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
      docs.music.splice(docs.music.indexOf(req.params.music_id), 1);
      docs.save();
      res.json(docs);
    } ); 
  

};