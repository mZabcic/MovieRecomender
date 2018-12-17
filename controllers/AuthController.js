const sget = require('simple-get')
User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const { NotFound } = require('http-errors')

const { validationResult } = require('express-validator/check');


exports.new = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);
        var user = new User(req.body);
        user.save(function (err, docs) {
            if (err) {
                res.status(400).json(err);
                return
            }
            console.log('New user');
            var token = jwt.sign({ _id: docs._id, name : docs.name, email : docs.email  }, config.secret, config.JWT);
            res.json(201, {
                token: token,
                user: docs
            });
        })
};

exports.newSocial = function(req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    var accesToken = req.body.authToken;
    sget.concat({
        url: 'https://graph.facebook.com/v3.1/me?fields=name,email,first_name,hometown,gender,last_name,age_range,birthday,movies',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accesToken
        },
        json: true
      }, function (err, response, data) {
        if (data.error != undefined) {
            res.status(400).json(data);
            return
        }
        data.facebookToken = accesToken;
        data.username = req.body.username;
        data.password = req.body.password;
        data.social = true;
        var user = new User(data);
        user.save(function (err, docs) {
            if (err) {
                res.status(400).json(err);
                return
            }
            console.log('New user');
            var token = jwt.sign({ _id: docs._id, name : docs.name, email : docs.email  }, config.secret, config.JWT);
            res.json(201, {
                token: token,
                user: docs
            });
        })
       }) 
}


exports.login = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).json({error: 'Error on the server.'});
        if (!user) return res.status(404).json({error : 'No user found.'});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error : "Password is wrong"});
        var token = jwt.sign({ _id: user._id, name : user.name, email : user.email  }, config.secret, config.JWT);
        res.status(200).send({ user: user, token: token });
});

}















