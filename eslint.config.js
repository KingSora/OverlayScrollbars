import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import typescriptParser from '@typescript-eslint/parser';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

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
      settings: {
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
          node: {
            extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.cts', '.mts', '.tsx'],
          },
        },
      },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
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
];
