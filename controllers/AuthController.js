const sget = require('simple-get')
User = require('../models/User');
var Movie = require('../models/Movie');
var Music = require('../models/Music');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

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
    req.body.role = "User";
    var user = new User(req.body);
    user.save(function (err, docs) {
        if (err) {
            res.status(400).json(err);
            return
        }
        console.log('New user');
        var token = jwt.sign({ _id: docs._id, email: docs.email, sub: docs._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
        res.status(201).json({
            token: token,
            user: docs
        });
    })
};



exports.newSocial = function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    var accesToken = req.body.access_token;
    sget.concat({
        url: 'https://graph.facebook.com/v3.1/me?fields=name,email,first_name,gender,last_name,birthday,movies{genre,name,cover,release_date,directed_by,fan_count,description},music{name,cover,genre,bio,band_members}',
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
        data.username = data.email;

        data.facebook_id = data.id;
        data.role = "User";
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
            element.id = 'FB-' + element.id
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
                            console.log(existingMusic);
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
                            console.log(existingMusic);
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
                        return console.error(err);
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
                    }
                });
        })

    })
}


exports.login = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).json({ error: 'Error on the server.' });
        if (!user) return res.status(404).json({ error: 'No user found.' });
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: "Password is wrong" });
        var token = jwt.sign({ _id: user._id, email: user.email, role: user.role, sub: user._id, iat: Math.floor(Date.now() / 1000) }, config.secret, config.JWT);
        res.status(200).json({ user: user, token: token });
    });

}















