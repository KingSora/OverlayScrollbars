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
          pattern: '**/*.{css,scss,sass}',
          group: 'unknown',
          position: 'after',
        },
      ],
    },
  ],
};

module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', 'json', '@typescript-eslint', 'import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
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
        project: ['./packages/**/tsconfig.json', './local/**/tsconfig.json'],
      },
    },
  },
  rules: defaultRules,
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      extends: ['plugin:@typescript-eslint/recommended', 'airbnb', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./packages/**/tsconfig.json', './local/**/tsconfig.json'],
      },
      rules: {
        ...defaultRules,
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
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
      },
    },
    {
      files: ['*.test.*', '**/tests/**'],
      rules: {
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
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
        'import/order': 'off',
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
