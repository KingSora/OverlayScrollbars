const defaultRules = {
  'func-names': 'off',
  'no-plusplus': 'off',
  'no-continue': 'off',
  'no-param-reassign': 'off',
  'no-nested-ternary': 'off',
  'no-underscore-dangle': 'off',
  'no-multi-assign': 'off',
  'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-cond-assign': ['error', 'except-parens'],
  camelcase: ['error', { allow: ['^__', '^UNSAFE_'] }],
  'prefer-destructuring': 'off',
  'consistent-return': 'off',
  'import/prefer-default-export': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/extensions': [
    'off',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'index', 'internal', 'unknown', 'type'],
      pathGroups: [
        {
          pattern: '*.{css,scss,sass}',
          group: 'unknown',
          patternOptions: { matchBase: true },
          position: 'after',
        },
      ],
    },
  ],
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    },
  ],
  'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
  'react/require-default-props': ['off'],
  'react/react-in-jsx-scope': 'off',
  'react/jsx-uses-react': 'off',
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': ['error'],
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': ['error'],
  'no-redeclare': 'off',
  '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^___',
      varsIgnorePattern: '^___',
      caughtErrorsIgnorePattern: '^___',
    },
  ],
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-this-alias': [
    'error',
    {
      allowDestructuring: true, // Allow `const { props, state } = this`; false by default
      allowedNames: ['self', '_self'], // Allow `const self = this`; `[]` by default
    },
  ],
};
const defaultPlugins = ['prettier', 'json', '@typescript-eslint', 'import', 'react'];

module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: defaultPlugins,
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './packages/**/tsconfig.json',
      './examples/**/tsconfig.json',
      './website/**/tsconfig.json',
      './local/**/tsconfig.json',
      './tsconfig.json',
    ],
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          './packages/**/tsconfig.json',
          './examples/**/tsconfig.json',
          './website/**/tsconfig.json',
          './local/**/tsconfig.json',
        ],
      },
    },
  },
  rules: defaultRules,
  overrides: [
    {
      files: ['*.test.*', '**/test/**/*'],
      plugins: [...defaultPlugins, 'jest-dom'],
      rules: {
        ...defaultRules,
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
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
      files: ['*rollup*'],
      rules: {
        'no-console': 'off',
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
      },
    },
  ],
};
