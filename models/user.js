'use strict';

const mongoose = require('mongoose');

const readJsonFileSync = require('../src/configs/configs-reader').readJsonFileSync;
const config = readJsonFileSync('configs/server.json');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    login: String, // login = username
    password: String,
    info: {
        name: String,
        phone: String,
        email: String,
        wallet: String
    },
    check: {
        email: Boolean,
        kys: Boolean // usercheck
    },
    roles: {
        user: {
            enabled: Boolean,
            permit: [{ type: String }]
        },
        admin: {
            enabled: Boolean, // adminstate
            permit: [{ type: String }] // adminrole: superuser | whitelister | locker | corrector | moderator
        },
        owner: {
            enabled: Boolean,
            permit: [{ type: String }]
        }
    }
});
const User = mongoose.model('user', userSchema, config['mongo3']['dbname']);

function initUser(data) {
    let user = new User();
    user.username = data.username ? data.username : '';
    user.login = data.username;
    user.password = data.password ? data.password : '';
    user.info.email = data.email ? data.email : '';
    user.info.name = 'Vasya Pupkin (new user)';
    user.info.phone = '-';
    user.info.wallet = '0x0000000000000000000000000000000000000000';
    user.check.email = false;
    user.check.kys = false;
    user.roles.user.enabled = false;
    user.roles.admin.enabled = false;
    user.roles.owner.enabled = false;
    return user;
}

module.exports = User;
module.exports.initUser = initUser;
