'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const config = require('../configs/configs-reader').getServerConfig();

const dbconnector = require('../db/dbconnector');
const User = dbconnector.User;

router.post('/register', (req, res) => {
    console.log(`${ req.baseUrl }/register`);
    const user = User.initUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    registerFormDataCheck(user)
        .catch(error => sendResponseFail(res, error, 'Incorrect form fields'))
        .then(user => userNoExistsIntoDB(user))
        .then(checkedUser => saveToDB(checkedUser))
        .then(registeredUser => sendResponseOk(res, registeredUser))
        .catch(error => sendResponseFail(res, error, 'User exists'));
});

router.post('/login', (req, res) => {
    console.log('/login');
    let userData = new User(req.body);
    User.findOne({username: userData.username}, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send('Invalid username or password');
            } else if (user.password !== userData.password) {
                res.status(401).send('Invalid username or password');
            } else {
                let payload = { subject: user._id };
                let token = jwt.sign(payload, config['token']['secretkey']);
                res.status(200).send({
                    token,
                    username: user.username,
                    wallet: user.info.wallet,
                    kys: user.check.kys ? "true": "false",
                    user: user.roles.user.enabled ? "true" : "false",
                    admin: user.roles.admin.enabled ? "true" : "false",
                    owner: user.roles.owner.enabled ? "true" : "false"
                });
            }
        }
    });
});

function registerFormDataCheck(user) {
    return new Promise((resolve, reject) => {
        if (user.username === '' || user.password === '' || user.info.email === '') {
            reject();
        }
        resolve(user);
    });
}

function userNoExistsIntoDB(user) {
    return new Promise((resolve, reject) => {
        User.find({username: user.username}, (error, username) => {
            if (error) {
                reject();
            }
            if (Object.keys(username).length !== 0) {
                reject(`There is user with username ${ user.username } in database`);
            } else {
                resolve(user);
            }
        });
    });
}

function saveToDB(user) {
    return new Promise((resolve, reject) => {
        user.save((error, registeredUser) => {
            if (error) {
                reject();
            }
            resolve(registeredUser);
        });
    });
}

function sendResponseOk(response, user) {
    console.log('Create user: ' + user.username);
    let payload = {subject: user._id};
    let token = jwt.sign(payload, config['token']['secretkey']);
    response.status(200).send({token});
}

function sendResponseFail(response, error, message) {
    console.log('send response fail: ' + error);
    response.status(401).send(message);
}

module.exports = router;
