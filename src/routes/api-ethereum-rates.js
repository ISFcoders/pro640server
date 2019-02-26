const fs = require('fs');
const express = require('express');
const router = express.Router();
const fileEthereumRates = require('../ethereum/rates').fileEthereumRates;

router.get('/', (req, res) => {
    res.send('From API route: ethereum rates');
});

router.get('/eth-rub', (req, res) => {
    if (fs.existsSync(fileEthereumRates)) {
        res.send(fs.readFileSync(fileEthereumRates, 'utf-8'));
    } else {
        res.send('[]');
    }
});

module.exports = router;