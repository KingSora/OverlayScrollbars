const jestBabel = require('@~local/config/jest-babel');

module.exports = (api) => {
  if (api.env('test')) {
    return jestBabel;
  }
  return {};
};
