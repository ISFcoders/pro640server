const fs = require('fs');
const Web3 = require('web3'); // web3: 1.0.0-beta.46

const config = require('../configs/configs-reader').getServerConfig();
const configProvider = config['blockchain']['provider'];
const configContract = config['blockchain']['contract'];

const wsProvider = configProvider['address'];
const web3 = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
const contractAddress = configContract['address'];
const contractABI = JSON.parse(fs.readFileSync(configContract['abi'], 'utf-8'));
const eContract = web3.eth.Contract(contractABI, contractAddress);

// TODO: must check ./var/blockchain directory existing...

module.exports.web3 = web3;
module.exports.config = config;
module.exports.contractInstance = eContract;