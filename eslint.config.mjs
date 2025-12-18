import js from '@eslint/js'
import tsEslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import nextPlugin from '@next/eslint-plugin-next'
import { globalIgnores } from 'eslint/config'


export default [
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  react.configs.flat.recommended,
  nextPlugin.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.errors?.rules,
      ...importPlugin.configs.warnings?.rules,
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],

    rules: {
      // Common
      'no-empty': 0,
      'no-empty-pattern': 0,
      'no-loss-of-precision': 0,
      'no-trailing-spaces': 1,
      semi: ['error', 'never'],
      'no-irregular-whitespace': 0,
      'no-extra-boolean-cast': 'off',
      'max-len': ['warn', { code: 140 }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'jsx-a11y/alt-text': 0,
      'comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],

      // TypeScript
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-unnecessary-type-constraint': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Restricted
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message:
            'Use localStorage module from @stakewise/frontwise-modules!',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'FixedNumber',
          message: 'Do not use FixedNumber, it is not safe.',
        },
      ],

      // Next
      '@next/next/no-html-link-for-pages': 0,

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import
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
      'import/newline-after-import': ['error', { count: 2 }],
    },
  },

  globalIgnores([
    'next-env.d.ts',
    '**/node_modules/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.turbo/**',
    '**/out/**',
  ]),

  {
    files: ['e2e/**/*.{js,ts,jsx,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },

  {
    files: [
      '**/*.config.*',
      'scripts/**/*.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
      },
    },
  },
]
