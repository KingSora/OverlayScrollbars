const fs = require('fs');
const { basename } = require('path');
const path = require('path');
const rollupDts = require('rollup-plugin-dts');
const { rollupTs } = require('./pipeline.common.plugins');

module.exports = (resolve, options) => {
  const { rollup, paths } = options;
  const { output: rollupOutput, input } = rollup;
  const { file } = rollupOutput;
  const { src: srcPath, types: typesPath } = paths;
  const dtsOutput = path.resolve(typesPath, `${file}.d.ts`);

  return [
    {
      input,
      onwarn: (warning, warn) => {
        if (warning.code !== 'EMPTY_BUNDLE') {
          warn(warning);
        }
      },
      output: {
        file: path.resolve(typesPath, `${file}`),
      },
      plugins: [rollupTs(srcPath, true)],
    },
    {
      input: path.join(typesPath, `${basename(input).replace('.ts', '.d.ts')}`),
      output: {
        file: dtsOutput,
      },
      plugins: [
        rollupDts.default({
          respectExternal: true,
          compilerOptions: {
            baseUrl: typesPath,
          },
        }),
        {
          writeBundle() {
            const filesAndDirs = fs.readdirSync(typesPath);
            filesAndDirs.forEach((fileOrDir) => {
              if (basename(fileOrDir) !== basename(dtsOutput)) {
                fs.rmSync(path.join(typesPath, fileOrDir), { recursive: true });
              }
            });
          },
        },
      ],
    },
  ];
};
