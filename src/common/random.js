'use strict';

const config = require('../configs/configs-reader');
const minValue = config.get.number('system.random.min', 1);
const maxValue = config.get.number('system.random.max', 99);

// Генерация псевдослучайного числа
function getRandomInt() {
    const minVal = Math.ceil(minValue);
    const maxVal = Math.floor(maxValue);
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

module.exports.getRandomInt = getRandomInt;
