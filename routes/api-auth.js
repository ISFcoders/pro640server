const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const config = require('../configs-reader').getServerConfig();

const dbconnector = require('../dbconnector');
const User = dbconnector.User;

router.post('/register', (req, res) => {
    console.log('/register');
    let reqUser = new User(req.body);
    reqUser = User.initUser(reqUser);

    User.find({username: reqUser.username}, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            console.log('length: ' + Object.keys(user).length);
            if (Object.keys(user).length === 0) {
                console.log('Find no users with login: ' + reqUser.username);
                reqUser.save((error, registeredUser) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Create user: ' + reqUser.username);
                        let payload = { subject: registeredUser._id };
                        let token = jwt.sign(payload, config['token']['secretkey']);
                        res.status(200).send({token});
                    }
                });
            } else {
                console.log(`There is user with username ${ reqUser.username } in database`);
                res.status(401).send('User exists');
            }
        }
    });
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
                    admin: user.adminstate ? "true" : "false",
                    owner: user.owner ? "true" : "false"
                });
            }
        }
    });
});

module.exports = router;