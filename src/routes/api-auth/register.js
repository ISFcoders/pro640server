/**
 * Вспомогательные функции, участвующие в обработке запроса /api/auth/register
 */
'use strict';

const jwt = require('jsonwebtoken');
const mailer = require('../../mailer/email-verification');

const config = require('../../common/configs-reader');
const configData = {
    secret: config.get.string('token.secretkey', () => { throw new Error('Cannot define secret key'); }),
    protocol: config.get.string('server.protocol', () => { throw new Error('Cannot define protocol'); }),
    baseurl: config.get.string('server.baseurl', () => { throw new Error('Cannot define base url'); }),
    port: config.get.string('server.port', () => { throw new Error('Cannot define port'); })
};

// Варианты пояснений к выдаваемым сервером HTTP-ответам
const failMessages = require('../../common/http-response').getFailMessagesEmptyObj();
failMessages.known = {
    incorrect_form_fields: 'Incorrect form fields',
    email_duplicate: 'Email duplicate',
    user_exists: 'User exists',
    incorrect_db_response: 'Incorrect database response'
};
failMessages.unknown = {
    internal_server_error: 'Internal server error'
};

// Первичная проверка данных, полученных из формы регистрации новой учетной записи
async function registerFormDataCheck(user) {
    return new Promise((resolve, reject) => {
        if (user.username === '' || user.password === '' || user.info.email === '') {
            reject(failMessages.known.incorrect_form_fields);
        }
        resolve(user);
    });
}

// Проверка передаваемого user.info.email на наличие в существующих учетных записях в БД
async function emailDuplicateCheckIntoDB(UserDB, user) {
    return new Promise((resolve, reject) => {
        UserDB.find ({ 'info.email': user.info.email }, (error, accounts) => {
            if (error) {
                reject(failMessages.known.incorrect_db_response);
            }
            if (accounts.length >= 1) { // уже существует учетная запись (или несколько) с таким же адресом электронной почты
                reject(failMessages.known.email_duplicate);
            }
            resolve(user);
        });
    });
}

// Проверка (по логину/username) наличия учетной записи в БД
async function userNoExistsIntoDB(UserDB, user) {
    return new Promise((resolve, reject) => {
        UserDB.find({ username: user.username }, (error, username) => {
            if (error) {
                reject(failMessages.known.incorrect_db_response);
            }
            if (Object.keys(username).length !== 0) {
                reject(failMessages.known.user_exists);
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
                reject(failMessages.known.incorrect_db_response);
            }
            resolve(registeredUser);
        });
    });
}

// Отправка HTTP-ответа (с кодом 200) об успехе запроса
async function sendResponseOk(response, user) {
    const random = require('../../common/random');
    return new Promise((resolve, reject) => {
        // token передается клиенту (в localStorage его браузера) и применяется в контроле сессий
        let payload = { subject: user._id };
        let token = jwt.sign(payload, configData.secret);
        response.status(200).send({ token });

        // token2 отправляется на электронную почту владельца учетной записи в виде проверочного кода
        let payload2 = { subject: user._id + random.getRandomInt() };
        let token2 = jwt.sign(payload2, configData.secret);
        resolve(token2);
    });
}

// Отправка HTTP-ответа (с кодом 401) о неуспехе запроса, а также о внутреннем сбое (код 500)
async function sendResponseFail(response, error) {
    if (failMessages.checkKnownFailMessage(error)) {
        response.status(401).send(error);
    } else {
        console.log(`send response fail: unknown fail -> http500: ${ error }`);
        response.status(500).send(failMessages.unknown.internal_server_error);
    }
}

// Отправка письма для прохождения верификации
async function sendVerificationMail(token, username, email) {
    if (token) {
        const url = `${ configData.protocol }://${ configData.baseurl }:${ configData.port }/verification/${ token }`;
        mailer.sendVerificationMail(username, email, url);
    }
}

module.exports.registerFormDataCheck = registerFormDataCheck;
module.exports.emailDuplicateCheckIntoDB = emailDuplicateCheckIntoDB;
module.exports.userNoExistsIntoDB = userNoExistsIntoDB;
module.exports.saveToDB = saveToDB;
module.exports.sendResponseOk = sendResponseOk;
module.exports.sendResponseFail = sendResponseFail;
module.exports.sendVerificationMail = sendVerificationMail;
