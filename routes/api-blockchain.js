const fs = require('fs');
const express = require('express');
const router = express.Router();
const fileOffersToSell = require('../blockchain/offers-to-sell').fileOffersToSell;

router.get('/', (req, res) => {
    res.send('From API route: blockchain');
});

router.get('/get-offers-to-sell', (req, res) => {
    if (fs.existsSync(fileOffersToSell)) {
        res.send(fs.readFileSync(fileOffersToSell, 'utf-8'));
    } else {
        res.send('[]');
    }
});

module.exports = router;