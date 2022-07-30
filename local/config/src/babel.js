module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isJest = api.caller((caller) => !!(caller && caller.name === 'babel-jest'));

  if (isJest) {
    return {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        ['@babel/plugin-proposal-private-methods', { loose: false }],
      ],
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
