const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3000;
const app = express();


// Server engine parts

const offersToSell = require('./src/blockchain/offers-to-sell');
offersToSell.init();
setInterval(offersToSell.requestAllOffersToSell, 40000);

const offersToBuy = require('./src/blockchain/offers-to-buy');
offersToBuy.init();
setInterval(offersToBuy.requestAllOffersToBuy, 43000);

const ethRates = require('./src/ethereum/rates');
ethRates.init();
setInterval(ethRates.requestEthereumRates, 125000);


// Routing

const api = require('./src/routes/api');
const apiAuth = require('./src/routes/api-auth');
const apiBlockchain = require('./src/routes/api-blockchain');
const apiEthrereumRates = require('./src/routes/api-ethereum-rates');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);
app.use('/api/auth', apiAuth);
app.use('/api/blockchain', apiBlockchain);
app.use('/api/ethereum-rates', apiEthrereumRates);

app.get('/', (req, res) => {
    res.send('ISF640 backend server');
});

app.listen(PORT, () => {
    console.log('Server running on localhost: ' + PORT);
});