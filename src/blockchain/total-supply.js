'use strict';

const w3base = require('./base');
const contract = w3base.contractInstanceBase;

function init() {
    setTimeout(requestTotalSupply, 500);
    return requestTotalSupply;
}

function requestTotalSupply() {
    contract.methods.totalSupply.call()
        .then((result) => {
            w3base.contractInfo.tokens.total_supply = parseInt(result, 10);
        })
        .catch((error) => {
            console.log('requestTotalSupply: ' + error);
        });
}

module.exports.init = init;
module.exports.requestTotalSupply = requestTotalSupply;
