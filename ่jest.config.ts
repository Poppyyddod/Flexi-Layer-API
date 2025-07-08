import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": [
        "**/src/Testing/Store/**/MySQL/*.test.ts"
    ],
    "moduleFileExtensions": [
        "ts",
        "js",
        "json",
        "node"
    ],
    "globals": {
        "ts-jest": {
            "tsconfig": "tsconfig.json"
        }
    },
    "setupFiles": [
        "tsconfig-paths/register"
    ],
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^@Helper/(.*)$": "<rootDir>/src/Helper/$1",
        "^@Configs/(.*)$": "<rootDir>/Configs/$1",
        "^@Store/(.*)$": "<rootDir>/src/Store/$1",
        "^@Testing/(.*)$": "<rootDir>/src/Testing/$1"
    }
};

export default config;
