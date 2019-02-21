const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const apiAuth = require('./routes/api-auth');
const apiBlockchain = require('./routes/api-blockchain');

const PORT = 3000;
const app = express();

const offersToSell = require('./blockchain/offers-to-sell');
offersToSell.init();
setInterval(offersToSell.requestAllOffersToSell, 30000);

const offersToBuy = require('./blockchain/offers-to-buy');
offersToBuy.init();
setInterval(offersToBuy.requestAllOffersToBuy, 30000);

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);
app.use('/api/auth', apiAuth);
app.use('/api/blockchain', apiBlockchain);

app.get('/', (req, res) => {
    res.send('ISF640 backend server');
});

app.listen(PORT, () => {
    console.log('Server running on localhost: ' + PORT);
});