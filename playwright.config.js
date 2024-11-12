export default {
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
};
