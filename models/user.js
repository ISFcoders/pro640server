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
            permit: [{ type: String }] // adminrole
        },
        owner: {
            enabled: Boolean,
            permit: [{ type: String }]
        }
    }
});

/*
    owner: Boolean,
    usercheck: Boolean, // checked | unchecked
    adminstate: Boolean, // no | yes
    adminrole: String, // superuser | whitelister | locker | corrector | moderator
    vallets: [{
        type: String
    }]
*/

function initUser(user) {
    user.login = user.username;
    user.info.name = 'Vasya Pupkin (new user)';
    user.info.phone = '-';
    user.info.email = '-';
    user.info.wallet = '0x0000000000000000000000000000000000000000';
    user.check.email = false;
    user.check.kys = false;
    user.roles.user.enabled = false;
    user.roles.admin.enabled = false;
    user.roles.owner.enabled = false;
    return user;
}

module.exports = mongoose.model('user', userSchema, config['mongo3']['dbname']);
module.exports.initUser = initUser;
