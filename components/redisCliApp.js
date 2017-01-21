
const assert = require('assert');
const lodash = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');
const multiExecAsync = require('./multiExecAsync');
const reduceMetas = require('./reduceMetas');
const Promise = bluebird;
const asserto = object => assert.strictEquals([], Object.keys(object).filter(key => object[key] === undefined));

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const debug = () => undefined;

module.exports = async meta => {
    debug(`redisApp {${Object.keys(meta.help).join(', ')}}`);
    try {
        const defaults = meta[process.env.NODE_ENV || 'production'];
        const config = reduceMetas(meta.help, process.env, {defaults});
        const client = redis.createClient(config.redisUrl);
        const logger = require('./redisLogger')(config, redis);
        return {
            assert, lodash, Promise,
            asserto,
            redis, client, logger, config,
            multiExecAsync
        };
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
