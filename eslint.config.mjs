import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'eslint:recommended', 
      'next', 
      'next/core-web-vitals', 
      'next/typescript', 
      'prettier'
    ],
    rules: {
      semi: ['error', 'always'],

      // Enforce arrow function for callbacks
      'prefer-arrow-callback': ['error'],

      // Enforce template literals
      'prefer-template': ['error'],

      // Enforce consistent indentation with 2 spaces
      'indent': ['error', 2],

      // Disallow unused variables
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],

      // Enforce strict equality checks
      'eqeqeq': ['error', 'always'],

      // Disallow console.log usage (production code should not have it)
      'no-console': ['error', { 'allow': ['warn', 'error'] }],

      // Disallow assignment in conditional expressions
      'no-cond-assign': ['error', 'always'],

      // Disallow unnecessary semicolons
      'no-extra-semi': 'error',

      // Disallow unused expressions
      'no-unused-expressions': 'error',

      // Require return statements in functions
      'consistent-return': 'error',

      // Enforce default parameters at the end of function arguments
      'default-param-last': 'error',

      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

      // Enforce consistent return statements
      'array-callback-return': 'error',

      // Enforce that all imports are in the right order
      'import/order': ['error', {
        'groups': [['builtin', 'external', 'internal']],
        'newlines-between': 'always'
      }]
    },
  }),
];

export default eslintConfig;
