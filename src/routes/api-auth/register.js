/**
 * Вспомогательные функции, участвующие в обработке запроса /api/auth/register
 */
'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../configs/configs-reader').getServerConfig();

// Первичная проверка данных, полученных из формы регистрации новой учетной записи
async function registerFormDataCheck(user) {
    return new Promise((resolve, reject) => {
        if (user.username === '' || user.password === '' || user.info.email === '') {
            reject();
        }
        resolve(user);
    });
}

// Проверка (по логину/username) наличия учетной записи в БД
async function userNoExistsIntoDB(UserDB, user) {
    return new Promise((resolve, reject) => {
        UserDB.find({username: user.username}, (error, username) => {
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

// Сохранение учетной записи в БД
async function saveToDB(user) {
    return new Promise((resolve, reject) => {
        user.save((error, registeredUser) => {
            if (error) {
                reject();
            }
            resolve(registeredUser);
        });
    });
}

// Отправка HTTP-ответа (с кодом 200) об успехе запроса
async function sendResponseOk(response, user) {
    console.log(`send response ok: ${ user.username }`);
    let payload = {
        subject: user._id
    };
    let token = jwt.sign(payload, config['token']['secretkey']);
    response.status(200).send({ token });
}

// Отправка HTTP-ответа (с кодом 401) о неуспехе запроса
async function sendResponseFail(response, error, message) {
    console.log(`send response fail: error=[${ error }] message=[${ message }]`);
    response.status(401).send(message);
}

module.exports.registerFormDataCheck = registerFormDataCheck;
module.exports.userNoExistsIntoDB = userNoExistsIntoDB;
module.exports.saveToDB = saveToDB;
module.exports.sendResponseOk = sendResponseOk;
module.exports.sendResponseFail = sendResponseFail;
