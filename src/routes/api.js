'use strict';

const express = require('express');
const router = express.Router();

const dbconnector = require('../db/dbconnector');
const User = dbconnector.User;
//const Data = dbconnector.Data;

const verifyToken = require('../common/token').verifyToken;

router.get('/', (req, res) => {
    console.log(`${ req.baseUrl }/`);
    res.status(200).send(`router: ${ req.baseUrl }/`);
});

router.get('/a', verifyToken, (req, res) => {
    console.log(`${ req.baseUrl }/a`);
    res.status(200).send(`router: ${ req.baseUrl }/a`);
});

router.post('/user', (req, res) => {
    let userData = new User(req.body);
    console.log('/api/user: username=' + userData.username);
    User.findOne({username: userData.username}, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send('Invalid username');
            } else {
                res.status(200).send({
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    vallets: user.vallets,
                    userstate: user.usercheck ? 'checked' : 'uncheked'
                });
            }
        }
    });
});

router.post('/adminlist', (req, res) => {
    console.log('adminlist by owner');
    User.find({adminstate: true}, (error, users) => {
        if (error) {
            console.log(error);
        } else {
            let userMass = [];
            users.forEach(function(user) {
               userMass[userMass.length] = {
                   username: user.username,
                   role: user.adminrole,
                   phone: user.phone,
                   name: user.name,
                   email: user.email
               };
            });
            res.status(200).send({
                list: userMass
            });
        }
    })
});

router.post('/userslist', (req, res) => {
    console.log('userslist by owner');
    User.find({usercheck: true}, (error, users) => {
        if (error) {
            console.log(error);
        } else {
            let userMass = [];
            users.forEach(function(user) {
                userMass[userMass.length] = {
                    username: user.username,
                    name: user.name,
                    email: user.email
                };
            });
            res.status(200).send({
                list: userMass
            });
        }
    })
});

module.exports = router;
