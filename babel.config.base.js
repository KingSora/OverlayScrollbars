module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  if (api.env('build')) {
    return {
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
    };
  }

  if (api.env('test')) {
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
