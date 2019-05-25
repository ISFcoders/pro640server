/**
 * Обработчики запросов /api/auth/
 */
'use strict';

const express = require('express');
const router = express.Router();

const dbconnector = require('../db/dbconnector');
const User = dbconnector.User;

// Запрос на регистрацию новой учетной записи /api/auth/register
router.post('/register', (req, res) => {
    console.log(`${ req.baseUrl }/register`);
    const lib = require('./api-auth/register');
    const user = User.initUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    lib.registerFormDataCheck(user)
        .then(() => lib.emailDuplicateCheckIntoDB(User, user))
        .then(user => lib.userNoExistsIntoDB(User, user))
        .then(checkedUser => lib.saveToDB(checkedUser))
        .then(registeredUser => lib.sendResponseOk(res, registeredUser))
        .then(registeredUser => lib.saveVerificationCodeToDB(User, registeredUser))
        .then(code => lib.sendVerificationMail(code, user))
        .catch(error => lib.sendResponseFail(res, error));
});

// Запрос на вход учетной записи /api/auth/login
router.post('/login', (req, res) => {
    console.log(`${ req.baseUrl }/login`);
    const lib = require('./api-auth/login');
    const user = new User(req.body);
    lib.registerFormDataCheck(user)
        //.catch(error => lib.sendResponseFail(res, error, 'Incorrect form fields'))
        .then(user => lib.findUserIntoDB(User, user))
        .then(user => lib.sendResponseOk(res, user))
        .catch(error => lib.sendResponseFail(res, error, error));
});

module.exports = router;
