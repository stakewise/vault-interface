import { configs } from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import pluginReact from 'eslint-plugin-react'
import { FlatCompat } from '@eslint/eslintrc'


const plugins = new FlatCompat()
  .config({
    extends: [
      'next',
      'next/core-web-vitals',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/recommended',
    ],
    plugins: [
      'import',
    ],
  })

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...plugins,
  ...configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: [
      '**/*.{js,ts,jsx,tsx}',
    ],
    rules: {
      // Common
      'no-trailing-spaces': 1,
      'semi': [ 'error', 'never' ],
      "max-len": [ 'warn', { 'code': 140 } ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'no-multiple-empty-lines': [ 'error', { 'max': 2 } ],
      'jsx-a11y/alt-text': 0,
      'comma-dangle': [
        'warn', {
          'arrays': 'always-multiline',
          'objects': 'always-multiline',
          'imports': 'always-multiline',
          'exports': 'always-multiline',
          'functions': 'never',
        },
      ],
      // Special
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-unnecessary-type-constraint': 0,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ],

      'no-restricted-globals': [
        'error',
        {
          'name': 'localStorage',
          'message': 'Use localStorage module from @stakewise/frontwise-modules!',
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          'name': 'FixedNumber',
          'message': 'Do not use FixedNumber, it is not safe.',
        },
      ],

      // Next
      '@next/next/no-html-link-for-pages': 0,

      // React hooks plugin
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import plugin
      'import/named': 0,
      'import/first': 0,
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'import/no-dynamic-require': 0,
      'import/prefer-default-export': 0,
      'import/no-webpack-loader-syntax': 0,
      'import/no-named-as-default-member': 1,
      'import/no-extraneous-dependencies': 0,
      'import/no-anonymous-default-export': 0,
      'import/newline-after-import': [ 'error', { 'count': 2 } ],
    },
  },
  globalIgnores([
    '**/*.graphql.ts',
  ]),
  {
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]


export default config
