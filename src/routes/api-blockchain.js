const fs = require('fs');
const express = require('express');
const router = express.Router();
const fileOffersToSell = require('../blockchain/offers-to-sell').fileOffersToSell;
const fileOffersToBuy = require('../blockchain/offers-to-buy').fileOffersToBuy;

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

router.get('/get-offers-to-buy', (req, res) => {
    if (fs.existsSync(fileOffersToBuy)) {
        res.send(fs.readFileSync(fileOffersToBuy, 'utf-8'));
    } else {
        res.send('[]');
    }
});

module.exports = router;