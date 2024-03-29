'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


// Server engine parts

const server = require('./src/common/server-emitter').server;
server.register(require('./src/blockchain/offers-to-sell').init(), {delay: 0, interval: 'short'});
server.register(require('./src/blockchain/offers-to-buy').init(), {delay: 1500, interval: 'short'});
server.register(require('./src/ethereum/rates').init(), {delay: 0, interval: 'large'});
server.register(require('./src/blockchain/total-supply').init(), {delay: 0, interval: 'medium'});


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

const config = require('./src/common/configs-reader');
const port = config.get.number('server.port', () => {
    throw new Error('FATAL ERROR: cannot define server port');
});

app.listen(port, () => {
    console.log('Server running on localhost: ' + port);
});
