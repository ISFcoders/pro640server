'use strict';

const config = require('../configs/configs-reader').getServerConfig();

const minValue = parseConfigValue('min', 1);
const maxValue = parseConfigValue('max', 99);

function parseConfigValue(key, defaultValue) {
    try {
        return parseValue(config['system']['random'][`${ key }`], defaultValue);
    } catch (e) {
        return defaultValue;
    }
}

// Преобразование строки в число (в случае ошибки - отдается значние по умолчанию defaultValue)
function parseValue(data, defaultValue) {
    if (data !== undefined) {
        let result = parseInt(data);
        if (typeof result === 'number') {
            return result;
        }
    }
    return defaultValue;
}

// Генерация псевдослучайного числа
function getRandomInt() {
    const minVal = Math.ceil(minValue);
    const maxVal = Math.floor(maxValue);
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

module.exports.getRandomInt = getRandomInt;
