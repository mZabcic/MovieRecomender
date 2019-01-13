const Weather = require('../models/Weather');
var config = require('../config');
const sget = require('simple-get')





exports.create = function (req, res) {
    if (req.user.role != 'Admin') {
        return res.status(403).json({error : 'Only admin can update weather'})
       }
    sget.concat({
        url: config.weather_url + '?id=3186886&units=metric'  + config.weather_apikey,
        method: 'GET',
        json: true
    }, function (err, response, data) {
        var weather = new Weather(data);
        weather.save((err, w) => {
            return res.json(w);
        });
    })
};



exports.get = function (req, res) {
    Weather.findOne({id : 3186886}, (err, data) => {
        res.json(data);
    })
};