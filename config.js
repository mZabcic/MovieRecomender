var blacklist = require('express-jwt-blacklist');



module.exports = {
    'secret': 'supersecret',
    'JWT' : {
        expiresIn: 86400, // expires in 24 hours
        jwtid: 'sub',

    },
    'isRevoked' : blacklist.isRevoked,
    'version' : 'v1',
    'moviedb_url' : 'https://api.themoviedb.org/3/',
    'moviedb_apikey' : '?api_key=f60a356bdd7b8698ad391f2b8b2feab9',
    'omdb_url' : 'http://www.omdbapi.com/',
    'omdb_apikey' : '?apikey=563467c',
    'weather_apikey' : '&APPID=1e584c67a181d166fd5de01b4db0b583',
    'weather_url' : 'http://api.openweathermap.org/data/2.5/weather'
};




