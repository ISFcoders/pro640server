const fs = require('fs');

const w3base = require('./base');
const check = require('../common/check-dir');
const web3 = w3base.web3;
const config = w3base.config;
const eContract = w3base.contractInstance;
const configOutput = config['blockchain']['output'];

const fileOffersToBuy = `${ configOutput['base'] }/${ configOutput['offerstobuy']}`;
let allOffersToBuy = [];
let tokensInfo = w3base.tokensInfoInit();

function init() {
    check.checkAndMakeDirPath(configOutput['base']);
    if (!fs.existsSync(fileOffersToBuy)) {
        updateOffersToBuy();
    }
    setTimeout(requestAllOffersToBuy, 500);
    return requestAllOffersToBuy;
}

function updateOffersToBuy() {
    fs.writeFileSync(fileOffersToBuy, JSON.stringify(allOffersToBuy));
    w3base.parseOffersArrayAndUpdateTokensInfo(allOffersToBuy, tokensInfo);
}

function requestAllOffersToBuy() {
    console.log('buy');
    let allOffers = [];
    let uniqueAddresses = new Set();
    getEvents();
    setTimeout(updateOffersToBuy, 5000);

    async function getEvents() {
        eContract.events
            .OfferToBuy({filter: {}, fromBlock: 0, toBlock: 'latest'}, function (error, result) {})
            .on('data', (event) => {
                let eventsJSON = web3.eth.abi.decodeLog(
                    [{
                        type: 'address',
                        name: 'buyer',
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

                makeRequest(eventsJSON.buyer);
                allOffersToBuy = allOffers;
            });
    }

    async function makeRequest(buyer) {
        eContract.methods
            .showOffersToBuy(buyer)
            .call({from: buyer}, (err, result) => {
                if (result) {
                    let item = {
                        buyer: buyer,
                        valueLot: result[1],
                        price: result[2],
                        status: result[0]
                    };
                    if (!uniqueAddresses.has(item.buyer) && item.valueLot != 0 && item.price != 0) {
                        uniqueAddresses.add(item.buyer);
                        allOffers.push(item);
                    }
                }
            });
    }
}

module.exports.init = init;
module.exports.requestAllOffersToBuy = requestAllOffersToBuy;
module.exports.fileOffersToBuy = fileOffersToBuy;
module.exports.tokensInfo = tokensInfo;