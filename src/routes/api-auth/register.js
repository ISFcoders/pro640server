/**
 * Вспомогательные функции, участвующие в обработке запроса /api/auth/register
 */
'use strict';

const jwt = require('jsonwebtoken');
const mailer = require('../../mailer/email-verification');

const config = require('../../common/configs-reader');
const configData = {
    secret: getConfig('token.secretkey'),
    server_name: getConfig('server.name'),
    protocol: getConfig('server.protocol'),
    baseurl: getConfig('server.baseurl'),
    port: getConfig('server.port'),
    verification_by_proxy: getConfig('server.verification_by_proxy'),
    proxy_protocol: getConfig('server.proxy.protocol'),
    proxy_host: getConfig('server.proxy.host'),
    proxy_port: getConfig('server.proxy.port')
};

// Функция-обертка для упрощения типовой обработки конфигурационных полей
function getConfig(selector) {
    return config.get.string(selector, () => {
        throw new Error(`Cannot define ${ selector }`);
    });
}

// Варианты пояснений к выдаваемым сервером HTTP-ответам
const failMessages = require('../../common/http-response').getFailMessagesEmptyObj();
failMessages.known = {
    incorrect_form_fields: 'Incorrect form fields',
    email_duplicate: 'Email duplicate',
    user_exists: 'User exists',
    incorrect_db_response: 'Incorrect database response',
    empty_verificaiton_code: 'Empty verification code'

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
    return new Promise((resolve, reject) => {
        // token передается клиенту (в localStorage его браузера) и применяется в контроле сессий
        let payload = { subject: user._id };
        let token = jwt.sign(payload, configData.secret);
        response.status(200).send({ token });
        resolve(user);
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
async function sendVerificationMail(code, currentUser) {
    let user = {
        name: currentUser.username,
        email: currentUser.info.email
    };
    let host = {
        url: selectHostUrl(),
        name: configData.server_name
    };
    const link = `${ host.url }/verification/${ user.name }=${ code }`;
    mailer.sendVerificationMail(user, link, host);

    // Осуществялется выбор конфигурационных полей и формирование адресной строки хоста.
    // Для внутреннего использования во время вызова функции создания и отправки письма для прохождения верификации.
    function selectHostUrl() {
        if (configData.verification_by_proxy === 'true') {
            return getHostUrl(configData.proxy_protocol, configData.proxy_host, configData.proxy_port);
        }
        return getHostUrl(configData.protocol, configData.baseurl, configData.port);
    }

    // Формирование адресной сторки хоста, в которй порт является опциональным значением.
    // Для внутреннего использования во время вызова функции создания и отправки письма для прохождения верификации.
    function getHostUrl(protocol, host, port) {
        let result = protocol + '://' + host;
        if (port !== 'default') {
            result += ':' + port;
        }
        return result;
    }
}

// Создание проверочной сторки для последующего прохождения верификации
function generateVerificationCode() {
    return getRandomPhrase() + '-' + getRandomPhrase() + '-' + getRandomPhrase();

    // Формируется строка из нескольких псевдослучайных чисел.
    // Для внутреннего использования во время вызова функции создания верификациооной строки.
    // Параметры:
    //      count - количество используемых псевдослучайных чисел
    function getRandomPhrase(count) {
        const random = require('../../common/random');
        if (count === undefined || typeof count !== 'number' || count <= 0) {
            count = 3;
        }
        let phrase = '';
        for (let i = 0; i < count; i++) {
            phrase += `${ random.getRandomInt() }`;
        }
        return phrase;
    }
}

async function saveVerificationCodeToDB(UserDB, user) {
    let code = generateVerificationCode();
    return new Promise((resolve, reject) => {
        let query = { username: user.username };
        let values = { verification: { email: { code: code }}};
        UserDB.updateOne(query, values, (err, res) => {
            if (err) {
                reject(faileMessages.known.incorrect_db_response);
            }
            if (code) {
                resolve(code);
            }
            reject(failMessages.known.empty_verificaiton_code);
        });
    });
}

module.exports.registerFormDataCheck = registerFormDataCheck;
module.exports.emailDuplicateCheckIntoDB = emailDuplicateCheckIntoDB;
module.exports.userNoExistsIntoDB = userNoExistsIntoDB;
module.exports.saveToDB = saveToDB;
module.exports.sendResponseOk = sendResponseOk;
module.exports.sendResponseFail = sendResponseFail;
module.exports.sendVerificationMail = sendVerificationMail;
module.exports.saveVerificationCodeToDB = saveVerificationCodeToDB;
