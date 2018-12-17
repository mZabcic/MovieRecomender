const sget = require('simple-get')
User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const { NotFound } = require('http-errors')

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
    returnUser(req, res); 
};



exports.getById = function (req, res) {
    
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
};

exports.me = function(req, res) {
        req.params.user_id = req.user._id;
        returnUser(req, res); 
  
};
