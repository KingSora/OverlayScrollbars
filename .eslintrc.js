const resolve = require('./resolve.config');

module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'airbnb', 'prettier'],
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: resolve.extensions,
        moduleDirectory: resolve.directories,
      },
    },
  },
  plugins: ['prettier', 'json', 'react', 'jest', 'import', '@typescript-eslint'],
  rules: {
    'func-names': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-cond-assign': ['error', 'except-parens'],
    camelcase: ['error', { allow: ['^__', '^UNSAFE_'] }],
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [
    {
      files: ['*.test.*'],
      rules: {
        'no-restricted-syntax': 'off',
        'no-param-reassign': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-console': 'off',
        'consistent-return': 'off',
        'symbol-description': 'off',
        'no-new-wrappers': 'off',
        'no-prototype-builtins': 'off',
        'no-void': 'off',
        'no-empty-function': 'off',
        'no-new-func': 'off',
      },
    },
    {
      files: ['rollup.config.*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
