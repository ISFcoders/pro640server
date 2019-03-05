const fs = require('fs');

const w3base = require('./base');
const check = require('../common/check-dir');
const web3 = w3base.web3;
const config = w3base.config;
const eContract = w3base.contractInstance;
const configOutput = config['blockchain']['output'];

const fileOffersToSell = `${ configOutput['base'] }/${ configOutput['offerstosell']}`;
let allOffersToSell = [];
let tokensInfo = w3base.tokensInfoInit();

function init() {
    check.checkAndMakeDirPath(configOutput['base']);
    if (!fs.existsSync(fileOffersToSell)) {
        updateOffersToSell();
    }
    setTimeout(requestAllOffersToSell, 500);
    return requestAllOffersToSell;
}

function updateOffersToSell() {
    fs.writeFileSync(fileOffersToSell, JSON.stringify(allOffersToSell));
    w3base.parseOffersArrayAndUpdateTokensInfo(allOffersToSell, tokensInfo);
}

function requestAllOffersToSell() {
    console.log('sell');
    let allOffers = [];
    let uniqueAddresses = new Set();
    getEvents();
    setTimeout(updateOffersToSell, 5000);

    async function getEvents() {
        eContract.events
            .OfferToSell({filter: {}, fromBlock: 0, toBlock: 'latest'}, function (error, result) {})
            .on('data', (event) => {
                let eventsJSON = web3.eth.abi.decodeLog(
                    [{
                        type: 'address',
                        name: 'seller',
                        indexed: true
                    }, {
                        type: 'uint256',
                        name: 'valueLot',
                        indexed: false
                    }, {
                        type: 'uint256',
                        name: 'price',
                        indexed: false
                    }],
                    event.raw.data,
                    event.raw.topics[1]); // topics[1] has address

                makeRequest(eventsJSON.seller);
                allOffersToSell = allOffers;
            });
    }

    async function makeRequest(seller) {
        eContract.methods
            .showOffersToSell(seller)
            .call({from: seller}, (err, result) => {
                if (result) {
                    let item = {
                        seller: seller,
                        valueLot: result[1],
                        price: result[2],
                        status: result[0]
                    };
                    if (!uniqueAddresses.has(item.seller) && item.valueLot != 0 && item.price != 0) {
                        uniqueAddresses.add(item.seller);
                        allOffers.push(item);
                    }
                }
            });
    }
}

module.exports.init = init;
module.exports.requestAllOffersToSell = requestAllOffersToSell;
module.exports.fileOffersToSell = fileOffersToSell;
module.exports.tokensInfo = tokensInfo;