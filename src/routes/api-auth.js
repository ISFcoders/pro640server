'use strict';

const express = require('express');
const router = express.Router();

const dbconnector = require('../db/dbconnector');
const User = dbconnector.User;

router.post('/register', (req, res) => {
    console.log(`${ req.baseUrl }/register`);
    const lib = require('./api-auth/register');
    const user = User.initUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    lib.registerFormDataCheck(user)
        .catch(error => lib.sendResponseFail(res, error, 'Incorrect form fields'))
        .then(user => lib.userNoExistsIntoDB(User, user))
        .then(checkedUser => lib.saveToDB(checkedUser))
        .then(registeredUser => lib.sendResponseOk(res, registeredUser))
        .catch(error => lib.sendResponseFail(res, error, 'User exists'));
});

router.post('/login', (req, res) => {
    console.log(`${ req.baseUrl }/login`);
    const lib = require('./api-auth/login');
    const user = new User(req.body);
    lib.registerFormDataCheck(user)
        .catch(error => lib.sendResponseFail(res, error, 'Incorrect form fields'))
        .then(user => lib.findUserIntoDB(User, user))
        .then(user => lib.sendResponseOk(res, user))
        .catch(error => lib.sendResponseFail(res, error, error));
});

module.exports = router;
