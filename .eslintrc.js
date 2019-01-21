module.exports = {
  'env': {
    'browser': false,
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2015
  },
  'rules': {
    'block-scoped-var': 'error',
    'curly': 'error',
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', 120],
    'no-template-curly-in-string': 'error',
    'no-var': 'warn',
    'object-curly-newline': 'error',
    'object-curly-spacing': 'error',
    'prefer-const': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'semi-spacing': 'error',
    'sort-imports': 'error',
    'space-before-blocks': 'error',
    'space-in-parens': [
      'error',
      'never'
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'strict': [
      'error',
      'global'
    ],
    'template-curly-spacing': 'error',
  }
};