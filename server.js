'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


// Server engine parts

const server = require('./src/common/server-emitter').server;
server.register(require('./src/blockchain/offers-to-sell').init(), {delay: 2000, interval: 'medium'});
server.register(require('./src/blockchain/offers-to-buy').init(), {delay: 5000, interval: 'medium'});
server.register(require('./src/ethereum/rates').init(), {delay: 3000, interval: 'large'});
server.register(require('./src/blockchain/total-supply').init(), {delay: 500, interval: 'medium'});


// Routing

const api = require('./src/routes/api');
const apiAuth = require('./src/routes/api-auth');
const apiBlockchain = require('./src/routes/api-blockchain');
const apiEthereumRates = require('./src/routes/api-ethereum-rates');
const apiVerification = require('./src/routes/verification');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);
app.use('/api/auth', apiAuth);
app.use('/api/blockchain', apiBlockchain);
app.use('/api/ethereum-rates', apiEthereumRates);
app.use('/verification', apiVerification);

app.get('/', (req, res) => {
    res.send('ISF640 backend server');
});


// Init port listener

const config = require('./src/configs/configs-reader').getServerConfig();
const port = parseInt(config['server']['port']);

app.listen(port, () => {
    console.log('Server running on localhost: ' + port);
});
