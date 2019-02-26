'use strict';

const fs = require('fs');
const got = require('got');
const check = require('../check-dir');

const config = require('../configs-reader').getServerConfig();
const configEthereum = config['ethereum'];
const configOutput = configEthereum['output'];

const fileEthereumRates = `${ configOutput['base'] }/${ configOutput['rates']}`;

function init() {
    check.checkAndMakeDirPath(configOutput['base']);
    if (!fs.existsSync(fileEthereumRates)) {
        updateEthereumRates({});
    }
    setTimeout(requestEthereumRates, 500);
}

function updateEthereumRates(data) {
    fs.writeFileSync(fileEthereumRates, JSON.stringify(data));
}

function requestEthereumRates() {
    got(configEthereum['ratesurl'], {json: true})
        .then(response => {
            updateEthereumRates(response.body);
        })
        .catch(error => {
            console.log('Cannot update ethereum rates');
            setTimeout(requestEthereumRates, 1000);
        });
}

module.exports.init = init;
module.exports.requestEthereumRates = requestEthereumRates;
module.exports.fileEthereumRates = fileEthereumRates;
