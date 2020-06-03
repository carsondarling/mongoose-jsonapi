module.exports = {
  env: {
    node: true,
    mocha: true,
  },

  rules: {
    'mocha/no-exclusive-tests': 'error',
  },

  plugins: ['mocha'],
};
