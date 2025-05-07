import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import typescriptParser from '@typescript-eslint/parser';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // global
  {
    ignores: ['node_modules', '.build', '.coverage', '.nyc_output'],
  },

  // javascript & typescript
  ...[
    eslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    prettierPluginRecommended,
    {
      rules: {
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
      },
      // settings: {
      //   'import/resolver': {
      //     typescript: {
      //       alwaysTryTypes: true,
      //       project: [
      //         './packages/**/tsconfig.json',
      //         './examples/**/tsconfig.json',
      //         './website/**/tsconfig.json',
      //         './local/**/tsconfig.json',
      //       ],
      //     },
      //     node: {
      //       extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.cts', '.mts', '.tsx'],
      //     },
      //   },
      // },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.nodeBuiltin,
        },
      },
    },
  ].map((configObj) => ({
    ...configObj,
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
  })),

  // typescript
  ...[
    ...tseslint.configs.recommended,
    importPlugin.flatConfigs.typescript,
    {
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          browser: true,
          node: true,
          es6: true,
        },
        parser: typescriptParser,
        parserOptions: {
          tsconfigRootDir: import.meta.dirname,
          project: true,
        },
      },
    },
  ].map((configObj) => ({
    ...configObj,
    files: ['**/*.{ts,mts,cts,tsx}'],
  })),

  // react
  ...[
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    {
      plugins: {
        'react-hooks': reactHooksPlugin,
      },
      rules: { ...reactHooksPlugin.configs.recommended.rules },
    },
  ].map((configObj) => ({
    ...configObj,
    files: ['**/*.{t,j}sx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  })),

  // test
  {
    files: ['**/test/**/*'],
    rules: {
      'no-empty': 'off',
      'no-shadow': 'off',
      'no-use-before-define': 'off',
      'no-restricted-syntax': 'off',
      'no-console': 'off',
      'consistent-return': 'off',
      'symbol-description': 'off',
      'no-new-wrappers': 'off',
      'no-prototype-builtins': 'off',
      'no-void': 'off',
      'no-empty-function': 'off',
      'no-new-func': 'off',

      // typescript
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-floating-promises': 'off',

      // react
      'react-hooks/rules-of-hooks': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },
];
