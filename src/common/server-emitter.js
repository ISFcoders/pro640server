'use strict';

const config = require('./configs-reader').getServerConfig();
const configServerIntervals = config['server']['emitterintervals'];

const EventEmitter = require('events').EventEmitter;

class ServerEmitter extends EventEmitter {
    register(func, params) {
        if (!params.delay) {
            params.delay = 1000;
        }
        if (!params.interval) {
            params.interval = 'medium';
        }
        if (params.interval !== 'short' || params.interval !== 'medium' || params.interval !== 'large') {
            params.interval = 'medium';
        }
        this.on(`server_${ params.interval }`, () => {
            setTimeout(func, params.delay);
        });
    }
}

const server = new ServerEmitter();

const intervals = ['short', 'medium', 'large'];
intervals.forEach((interval) => {
    setInterval(() => {
        server.emit(`server_${ interval }`);
    }, configServerIntervals[interval]);
});

module.exports.server = server;
