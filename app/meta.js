
module.exports = {
    info: {
        default: 'verbose',
        options: ['terse', 'verbose'],
        description: 'display configuration defaults'
    },
    redisUrl: {
        default: 'redis://localhost:6379'
    },
    loggerLevel: {
        default: 'info'
    },
    pattern: {
        default: '*',
        description: 'matching pattern for Redis scan'
    },
    field: {
        description: 'name of the hashes field to print'
    },
    format: {
        default: 'terse',
        options: ['terse', 'verbose']
    }
};
