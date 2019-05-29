module.exports = {
    ...require('./jest.config'),
    reporters: [
        'default',
        '@wishtack/jest-tcr'
    ]
};
