module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isRollup = api.caller((caller) => !!(caller && caller.name === 'babel-rollup-build'));
  const isJest = api.caller((caller) => !!(caller && caller.name === 'babel-jest'));

  if (isRollup) {
    return {
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
    };
  }

  if (isJest) {
    return {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-typescript',
      ],
    };
  }

  return {};
};
