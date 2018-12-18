var blacklist = require('express-jwt-blacklist');



module.exports = {
    'secret': 'supersecret',
    'JWT' : {
        expiresIn: 86400, // expires in 24 hours
        jwtid: 'sub',

    },
    'isRevoked' : blacklist.isRevoked,
    'version' : 'v1'
};