const express = require('express');

const router = express.Router();

const dbconnector = require('../db/dbconnector');
const User = dbconnector.User;
//const Data = dbconnector.Data;

const verifyToken = require('../common/token').verifyToken;

router.get('/', (req, res) => {
    res.send('From API route');
});

router.post('/user', (req, res) => {
    let userData = new User(req.body);
    console.log('/api/user: username=' + userData.username);
    User.findOne({username: userData.username}, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send('Invalid username');
            } else {
                res.status(200).send({
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    vallets: user.vallets,
                    userstate: user.usercheck ? 'checked' : 'uncheked'
                });
            }
        }
    });
});

router.post('/adminlist', (req, res) => {
    console.log('adminlist by owner');
    User.find({adminstate: true}, (error, users) => {
        if (error) {
            console.log(error);
        } else {
            let userMass = [];
            users.forEach(function(user) {
               userMass[userMass.length] = {
                   username: user.username,
                   role: user.adminrole,
                   phone: user.phone,
                   name: user.name,
                   email: user.email
               };
            });
            res.status(200).send({
                list: userMass
            });
        }
    })
});

router.post('/userslist', (req, res) => {
    console.log('userslist by owner');
    User.find({usercheck: true}, (error, users) => {
        if (error) {
            console.log(error);
        } else {
            let userMass = [];
            users.forEach(function(user) {
                userMass[userMass.length] = {
                    username: user.username,
                    name: user.name,
                    email: user.email
                };
            });
            res.status(200).send({
                list: userMass
            });
        }
    })
});
router.post('/krasikov/datatab', (req, res) => {
    res.status(404).send('No path: /krasikov/datatab');
});
/*router.get('/krasikov/datatab', (req, res) => {
    Data.find({table: 'price'}, (error, rows) => {
        if (error) {
           console.log(error);
        } else {
           let rowMass = [];
           rows.forEach(function(row) {
               rowMass[rowMass.length] = {
                   table: row.table,
                   row: row.row,
                   column: row.column,
                   data: row.data
               };
           });
           res.status(200).send({
               list: rowMass
           });
        }
    })
});

router.get('/events', (req, res) => {
    let events = [
        {
            "_id": "1",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ];
    res.json(events);
});

router.get('/special', verifyToken, (req, res) => {
    let events = [
        {
            "_id": "1",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ];
    res.json(events);
});*/

module.exports = router;