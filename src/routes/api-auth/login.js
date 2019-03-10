'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../configs/configs-reader').getServerConfig();

async function registerFormDataCheck(user) {
    return new Promise((resolve, reject) => {
        if (user.username === '' || user.password === '') {
            reject();
        }
        resolve(user);
    });
}

async function findUserIntoDB(UserDB, reqUser) {
    return new Promise((resolve, reject) => {
        UserDB.findOne({username: reqUser.username}, (error, dbUser) => {
            if (error) {
                console.log(`find user into db err ${ error }`);
                reject();
            }
            if (!dbUser) {
                reject('Invalid username or password');
            }
            if (reqUser.password !== dbUser.password) {
                reject('Invalid username or password');
            }
            resolve(dbUser);
        });
    });
}

async function sendResponseOk(response, user) {
    console.log('send response ok');
    const payload = {
        subject: user._id
    };
    const token = jwt.sign(payload, config['token']['secretkey']);
    response.status(200).send({
        token,
        username: user.username,
        wallet: user.info.wallet,
        kys: user.check.kys ? "true": "false",
        user: user.roles.user.enabled ? "true" : "false",
        admin: user.roles.admin.enabled ? "true" : "false",
        owner: user.roles.owner.enabled ? "true" : "false"
    });
}

async function sendResponseFail(response, error, message) {
    console.log(`send response fail: error=[${ error }] message=[${ message }]`);
    response.status(401).send(message);
}

module.exports.registerFormDataCheck = registerFormDataCheck;
module.exports.findUserIntoDB = findUserIntoDB;
module.exports.sendResponseOk = sendResponseOk;
module.exports.sendResponseFail = sendResponseFail;
