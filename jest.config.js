// Crear nuevo archivo jest.config.js en la raíz:
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios|react-bootstrap|react-icons)/)'
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.js'
    ]
};