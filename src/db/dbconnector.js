const mongoose = require('mongoose');

//const readJsonFileSync = require('./configs-reader').readJsonFileSync;
//const config = readJsonFileSync('configs/server.json');
const config = require('../configs/configs-reader').getServerConfig();

function getDB(id) {
    return `mongodb://`
        + `${ config[id]['username'] }:`
        + `${ config[id]['password'] }@`
        + `${ config[id]['url']      }:`
        + `${ config[id]['port']     }/`
        + `${ config[id]['dbname']   }`; // 'mongodb://<user_name>:<user_password>@<url>:<port>/<db_name>';
}

function mongoChecker(err, debugId) {
    return err
        ? 'Cannot connect to mongodb ' + debugId + '. ' + err
        : 'Connected to mongodb ' + debugId;
}

const User = require('../../models/user');
const db = getDB('mongo');
mongoose.connect(db, err => {
    console.log(mongoChecker(err, '#1 (accounts) ' + db));
});

module.exports.User = User;
module.exports.config = config;

/*
const Data = require('./models/data');
const db2 = getDB('mongo2');
mongoose.connect(db2, err => {
    console.log(mongoChecker(err, '#2 (krasikov data) ' + db2));
});

module.exports.Data = Data;
*/