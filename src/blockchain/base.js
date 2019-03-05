'use strict';

const fs = require('fs');
const Web3 = require('web3'); // web3: 1.0.0-beta.46

const config = require('../configs/configs-reader').getServerConfig();
const configProvider = config['blockchain']['provider'];
const configContract = config['blockchain']['contract'];

const contractAddress = configContract['address'];
const contractABI = JSON.parse(fs.readFileSync(configContract['abi'], 'utf-8'));

const wsProviderAddress = configProvider['websocket']['address'];
const web3ws = new Web3(new Web3.providers.WebsocketProvider(wsProviderAddress));
const wsContract = web3ws.eth.Contract(contractABI, contractAddress);

const httpProviderAddress = configProvider['http']['address'];
const web3http = new Web3(new Web3.providers.HttpProvider(httpProviderAddress));
const httpContract = web3http.eth.Contract(contractABI, contractAddress);

let contractInfo = getEmptyInfoContract();

// TODO: must check ./var/blockchain directory existing...

function tokensInfoInit() {
    return {
        tokens: {
            total: 0,
            average: 0
        },
        cost: {
            total: 0,
            average: 0
        }
    };
}

function getEmptyInfoContract() {
    return {
        tokens: {
            total_supply: 0,
            sell: 0,
            buy: 0
        },
        average_cost: {
            sell: {
                last_block: 0,
                last_date: 0
            },
            buy: {
                last_block: 0,
                last_date: 0
            }
        },
        successful_transactions: {
            sell: {
                last_24hours: 0,
                all_days: 0
            },
            buy: {
                last_24hours: 0,
                all_days: 0
            }
        },
        canceled_transactions: {
            last_24hours: 0,
            all_days: 0
        },
        gas_cost: {
            offer_to_buy: 0,
            offer_to_sell: 0,
            cancel_offer_deal: 0
        }
    };
}

function tokensInfoUpdate(tokensInfo, tokensTotal, costTotal, offersCount) {
    if (offersCount > 0) {
        tokensInfo.tokens.total = tokensTotal;
        tokensInfo.tokens.average = Math.floor(tokensTotal / offersCount);
        tokensInfo.cost.total = costTotal;
        tokensInfo.cost.average = Math.floor(costTotal / offersCount);
    }
}

function parseOffersArray(allOffersArray) {
    let res = {
        count: 0,
        tokens: 0,
        cost: 0
    };
    allOffersArray.forEach((item) => {
        res.tokens += parseInt(item.valueLot, 10);
        res.cost += parseInt(item.price, 10);
        res.count += 1;
    });
    return res;
}

module.exports.web3 = web3ws;
module.exports.config = config;
module.exports.contractInstance = wsContract;
module.exports.contractInstanceBase = httpContract;
module.exports.contractInfo = contractInfo;
module.exports.tokensInfoInit = tokensInfoInit;
module.exports.tokensInfoUpdate = tokensInfoUpdate;
module.exports.parseOffersArray = parseOffersArray;
module.exports.getEmptyInfoContract = getEmptyInfoContract;
