'use strict';

// Генерация псевдослучайного числа
function getRandomInt(min, max) {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

module.exports.getRandomInt = getRandomInt;
