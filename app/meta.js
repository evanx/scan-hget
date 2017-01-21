module.exports = {
    redisUrl: {
        default: 'redis://localhost:6379'
    },
    loggerLevel: {
        default: 'info'
    },
    pattern: {
        default: '*',
        description: 'Matching pattern for Redis scan'
    },
    field: {
        description: 'Field to print'
    },
    format: {
        default: 'terse',
        options: ['terse', 'verbose']
    }
};
