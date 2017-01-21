
const redis = require('redis');
const bluebird = require('bluebird');
const multiExecAsync = require('./multiExecAsync');
const reduceMetas = require('./reduceMetas');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const debug = () => undefined;

module.exports = async metas => {
    debug(`redisApp {${Object.keys(metas).join(', ')}}`);
    try {
        const config = reduceMetas(metas, process.env);
        const client = redis.createClient(config.redisUrl);
        const logger = require('./redisLogger')(config, redis);
        return {redis, client, logger, config};
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
