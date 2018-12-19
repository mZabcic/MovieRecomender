const sget = require('simple-get')
User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const { NotFound } = require('http-errors')

const { validationResult } = require('express-validator/check');

/**
 * 
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

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
            var token = jwt.sign({ _id: docs._id, name : docs.name, email : docs.email, sub : docs._id,  iat : Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
            res.status(201).json({
                token: token,
                user: docs
            });
        })
};

exports.newSocial = function(req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    var accesToken = req.body.access_token;
    sget.concat({
        url: 'https://graph.facebook.com/v3.1/me?fields=name,email,first_name,gender,last_name,birthday,movies',
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
        data.facebook_token = accesToken;
        data.username = req.body.username;
        data.password = req.body.password;
        data.social = true;
        data.movies = data.movies.data;
        data.facebook_id = data.id;
        if (data.gender == 'male') {
            data.gender = 'M';
        } else {
            data.gender = 'F';
        }
        delete data.id;
        var user = new User(data);
        user.save(function (err, docs) {
            if (err) {
                res.status(400).json(err);
                return
            }
            console.log('New user');
            var token = jwt.sign({ _id: docs._id, name : docs.name, email : docs.email, sub : docs._id,  iat : Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
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
        var token = jwt.sign({ _id: user._id, name : user.name, email : user.email, sub : docs._id/*, iat : Math.floor(Date.now() / 1000)*/ }, config.secret, config.JWT);
        return res.status(200).send({ user: user, token: token });
});

}















