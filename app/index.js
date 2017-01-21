
const assert = require('assert');
const lodash = require('lodash');

require('../components/redisApp')(require('./meta')).then(main);

const state = {};

async function main(context) {
    Object.assign(global, context);
    logger.level = config.loggerLevel;
    logger.debug('main', config);
    try {
    } catch (err) {
        console.error(err);
    } finally {
    }
}

async function subscribeHub({hubNamespace, hubRedis}) {
    state.clientHub = redis.createClient(hubRedis);
    state.clientHub.on('message', (channel, message) => {
    });
    state.clientHub.subscribe([hubNamespace, secret].join(':'));
}


async function end() {
    client.quit();
    if (state.clientHub) {
        state.clientHub.quit();
    }
}
