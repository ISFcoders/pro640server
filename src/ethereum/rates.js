'use strict';

const fs = require('fs');
const got = require('got');

const check = require('../common/check-dir');
const config = require('../configs/configs-reader').getServerConfig();
const configEthereum = config['ethereum'];
const configOutput = configEthereum['output'];

const fileEthereumRates = `${ configOutput['base'] }/${ configOutput['rates']}`;

function init() {
    check.checkAndMakeDirPath(configOutput['base']);
    if (!fs.existsSync(fileEthereumRates)) {
        updateEthereumRates({});
    }
    setTimeout(requestEthereumRates, 500);
    return requestEthereumRates;
}

function updateEthereumRates(data) {
    fs.writeFileSync(fileEthereumRates, JSON.stringify(data));
}

function requestEthereumRates() {
    console.log('rates');
    got(configEthereum['ratesurl'], {json: true, hooks: {
        beforeRedirect: [
            options => {
                console.log('before redirect: followRedirect=' + options.followRedirect);
                //const util = require('util');
                //console.log(util.inspect(options));
                options.followRedirect = false;

            }
        ]
        }})
        //.on('request', request => { console.log('request' + request); })
        //.on('response', response => { console.log('response' + response.body); })
        .then(response => {
            updateEthereumRates(response.body);
        })
        .catch(error => {
            console.log('Cannot update ethereum rates: ' + error);
        });
}

module.exports.init = init;
module.exports.requestEthereumRates = requestEthereumRates;
module.exports.fileEthereumRates = fileEthereumRates;
