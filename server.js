const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3000;
const app = express();


// Server engine parts

const server = require('./src/common/server-emitter').server;
server.register(require('./src/blockchain/offers-to-sell').init(), {delay: 2000, interval: 'medium'});
server.register(require('./src/blockchain/offers-to-buy').init(), {delay: 5000, interval: 'medium'});
server.register(require('./src/ethereum/rates').init(), {delay: 3000, interval: 'large'});


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
