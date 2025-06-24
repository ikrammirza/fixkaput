module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
