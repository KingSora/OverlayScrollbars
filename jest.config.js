// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    moduleDirectories: [
        "src",
        "node_modules",
    ],
    moduleFileExtensions: [
        "js",
        "json",
        "jsx",
        "ts",
        "tsx",
        "node"
    ],
    testPathIgnorePatterns: [
        "\\\\node_modules\\\\", "./dist"
    ],
    verbose: true,
};