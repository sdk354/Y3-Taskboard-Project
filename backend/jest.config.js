export default {
  testEnvironment: "node",
  transform: {}, // no Babel — run ESM as written
  testTimeout: 30000, // mongodb-memory-server's first boot is slow when workers run in parallel
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/seeds/**",
    "!src/config/**",
  ],
  coverageThreshold: {
    global: { statements: 65, branches: 45, functions: 70 },
  },
};
