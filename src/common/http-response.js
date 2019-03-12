/**
 * Вспомогательный код, участвующий в формировании ответов сервера на HTTP-запросы (в частности, на API-запросы)
 */
'use strict';

// Создается объект для его последующего наполения всеми вариантами ответов сервера на HTTP-запросы
function getFailMessagesEmptyObj() {
    const failMessages = {
        known: { }, // в блоке 'known' будут перечислены все известные варианты ответов (known -> HTTP 401)
        unknown: { } // в блоке 'unknown' будут перечислены 'экстраординарные' варианты ответов (unknown -> HTTP 500)
    };
    failMessages.checkKnownFailMessage = (message) => {
        let result = false;
        Object.keys(failMessages.known).forEach(key => {
            if (failMessages.known[key] === message) {
                result = true;
            }
        });
        return result;
    };
    return failMessages;
}

module.exports.getFailMessagesEmptyObj = getFailMessagesEmptyObj;
