export default {
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {tsconfig: `./e2e/tsconfig.json`}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1",
  },
  testTimeout: 80000,
  globalSetup: "./jest-global-setup.js",
  globalTeardown: "./jest-global-teardown.js",
  globals: {
    TARGET_PORT: process.env.PORT ?? 4444,
    TARGET_PAGE_URL: `http://localhost:${process.env.PORT ?? 4444}`,
  },
  watchman: false,
};

process.env.JEST_PUPPETEER_CONFIG = "./e2e/jest-puppeteer.config.js";
