module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    testMatch: [
        '<rootDir>/**/tests/*/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/cypress/'
    ],
    setupFilesAfterEnv: [
        "<rootDir>/tests/setupTests.ts"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    moduleNameMapper: {
        "^@(components|contexts|hooks|mocks|pages|public|reducers|tests|theme|utils)(.*)$": "<rootDir>/$1$2"
    },
    testEnvironment: "jsdom"
};
