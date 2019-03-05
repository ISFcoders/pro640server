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

function tokensInfoUpdate(tokensInfo, tokensTotal, costTotal, offersCount) {
    if (offersCount > 0) {
        tokensInfo.tokens.total = tokensTotal;
        tokensInfo.tokens.average = Math.floor(tokensTotal / offersCount);
        tokensInfo.cost.total = costTotal;
        tokensInfo.cost.average = Math.floor(costTotal / offersCount);
    }
}

function parseOffersArrayAndUpdateTokensInfo(allOffersArray, tokensInfo) {
    let count = 0;
    let tokensTotal = 0;
    let costTotal = 0;
    allOffersArray.forEach((element) => {
        count += 1;
        tokensTotal += parseInt(element.valueLot, 10);
        costTotal += parseInt(element.price, 10);
    });
    tokensInfoUpdate(tokensInfo, tokensTotal, costTotal, count);
}

module.exports.web3 = web3;
module.exports.config = config;
module.exports.contractInstance = eContract;
module.exports.tokensInfoInit = tokensInfoInit;
module.exports.parseOffersArrayAndUpdateTokensInfo = parseOffersArrayAndUpdateTokensInfo;