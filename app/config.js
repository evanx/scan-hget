
module.exports = {
    required: {
        pattern: {
            description: 'the matching pattern for Redis scan',
            example: '*'
        },
        field: {
            description: 'name of the hashes field to print'
        },
        limit: {
            default: 30,
            description: 'the maximum number of keys to print',
            note: 'zero means unlimited'
        },
        redisUrl: {
            default: 'redis://localhost:6379',
            description: 'the Redis URL'
        },
        format: {
            default: 'key',
            description: 'the output format',
            options: ['key', 'field', 'both', 'value', 'all']
        },
        logging: {
            default: 'info',
            description: 'the logging level'
        },
    },
    development: {
        logging: 'debug',
        pattern: '*',
        format: 'verbose'
    },
};
