const fs = require('fs');
const express = require('express');
const router = express.Router();
const offersToSell = require('../blockchain/offers-to-sell');
const offersToBuy = require('../blockchain/offers-to-buy');

router.get('/', (req, res) => {
    res.send('From API route: blockchain');
});

router.get('/get-offers-to-sell', (req, res) => {
    if (fs.existsSync(offersToSell.fileOffersToSell)) {
        res.send(fs.readFileSync(offersToSell.fileOffersToSell, 'utf-8'));
    } else {
        res.send('[]');
    }
});

router.get('/get-offers-to-buy', (req, res) => {
    if (fs.existsSync(offersToBuy.fileOffersToBuy)) {
        res.send(fs.readFileSync(offersToBuy.fileOffersToBuy, 'utf-8'));
    } else {
        res.send('[]');
    }
});

router.get('/info-offers-to-sell', (req, res) => {
    res.status(200).send(offersToSell.tokensInfo);
});

router.get('/info-offers-to-buy', (req, res) => {
    res.status(200).send(offersToBuy.tokensInfo);
});

module.exports = router;