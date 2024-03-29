'use strict';

const jwt = require('jsonwebtoken');
const config = require('./configs-reader').getServerConfig();

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, `${config['token']['secretkey']}`);
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}

module.exports.verifyToken = verifyToken;