'use strict';

const fs = require('fs');
const path = require('path');

const appDir = path.dirname(require.main.filename) + '/';
const configData = loadServerConfig();

const get = {
    number: getNumber,
    string: getString,
    object: getObject
};

function readJsonFileSync(filepath) {
    const file = fs.readFileSync(appDir + filepath, 'utf-8');
    return JSON.parse(file);
}

function loadServerConfig() {
    return readJsonFileSync('configs/server.json');
}

function getServerConfig() {
    return configData;
}

function getNumber(selector, errCallback) {
    let config = getServerConfig();
    try {
        selector.split('.').forEach(item => {
            config = config[`${ item }`];
        });
        config = parseNumber(config);
    } catch (e) {
        if (typeof errCallback === 'undefined') {
            throw new Error('cannot parse callback');
        }
        if (typeof errCallback === 'function') {
            return errCallback();
        }
        if (typeof errCallback === 'number') {
            return errCallback;
        }
        throw new Error('cannot parse callback');
    }
    return config;
}

function getString(selector, errCallback) {
    let data = getServerConfig();
    try {
        selector.split('.').forEach(item => {
            data = data[`${ item }`];
        });
    } catch (e) {
        if (typeof errCallback === 'undefined') {
            throw new Error('cannot parse callback');
        }
        if (typeof errCallback === 'function') {
            return errCallback();
        }
        if (typeof errCallback === 'string') {
            return errCallback;
        }
        throw new Error('cannot parse callback');
    }
    return data;
}

function getObject(selector, errCallback) {
    throw new Error('empty function getObject');
}

// Преобразование строки в число
function parseNumber(data) {
    if (data !== undefined) {
        let result = parseInt(data);
        if (!isNaN(result) && typeof result === 'number') {
            return result;
        }
    }
    throw new Error('cannot parse value to number');
}

module.exports.readJsonFileSync = readJsonFileSync;
module.exports.getServerConfig = getServerConfig;
module.exports.get = get;
