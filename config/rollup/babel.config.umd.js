module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          ie: '11',
        },
      },
    ],
  ],
};
