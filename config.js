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
    'moviedb_apikey' : '?api_key=f60a356bdd7b8698ad391f2b8b2feab9'
};