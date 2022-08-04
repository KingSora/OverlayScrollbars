module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          firefox: '54',
          chrome: '58',
          ie: '11',
          esmodules: false,
        },
      },
    ],
  ],
};
