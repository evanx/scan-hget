
module.exports = {
    development: {
        logging: 'debug',
        pattern: '*',
        format: 'verbose'
    },
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
            note: 'zero means unlimited',
            example: 0
        },
        redisUrl: {
            default: 'redis://localhost:6379',
            description: 'the Redis URL'
        },
        logging: {
            default: 'info',
            description: 'the logging level'
        },
        format: {
            default: 'terse',
            description: 'the output format',
            options: ['terse', 'verbose']
        },
    }
};
