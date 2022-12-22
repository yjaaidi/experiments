module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.m?(t|j)sx?$": ["@swc/jest"],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|ct))\\.[jt]sx?$",
  transformIgnorePatterns: ["/node_modules/(?!(@angular|@testing-library)/)"],
};
