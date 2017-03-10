
module.exports = pkg => ({
    description: pkg.description,
    env: {
        pattern: {
            description: 'the matching pattern for Redis scan',
            example: '*'
        },
        field: {
            description: 'name of the hashes field to print'
        },
        limit: {
            description: 'the maximum number of keys to print',
            note: 'zero means unlimited',
            default: 30
        },
        redisHost: {
            description: 'the Redis host',
            default: 'localhost'
        },
        format: {
            description: 'the output format',
            options: ['key', 'value', 'both', 'json'],
            default: 'key',
        },
        logging: {
            default: 'info',
            description: 'the logging level'
        }
    },
    development: {
        logging: 'debug'
    },
});
