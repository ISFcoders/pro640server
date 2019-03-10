'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(`${ req.baseUrl }`);
    res.status(200).send(`router: ${ req.baseUrl }`);
});

router.get('/?*', (req, res) => {
    console.log(`${ req.baseUrl }${ req.url }`);
    console.log(req.params['0']);
    res.status(200).send(`router: ${ req.baseUrl }${ req.url }`);
});

module.exports = router;
