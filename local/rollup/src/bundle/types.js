import fs from 'node:fs';
import path from 'node:path';
import rollupDts from 'rollup-plugin-dts';
import buildPlugins from './plugins.js';

const { rollupTs } = buildPlugins;
const tsFileEnding = '.ts';
const tsDeclarationFileEnding = `.d${tsFileEnding}`;

export default (resolve, options) => {
  const { rollup, paths } = options;
  const { output: rollupOutput, input } = rollup;
  const { file } = rollupOutput;
  const { types: typesPath } = paths;
  const dtsOutput = path.resolve(typesPath, `${file}${tsDeclarationFileEnding}`);

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
      external: [...resolve.styleExtensions.map((ext) => new RegExp(`.*\\${ext}`))],
      plugins: [rollupTs(input, true)],
    },
    {
      input: path.join(
        typesPath,
        `${path.basename(input).replace(tsFileEnding, tsDeclarationFileEnding)}`
      ),
      output: {
        file: dtsOutput,
      },
      external: [...resolve.styleExtensions.map((ext) => new RegExp(`.*\\${ext}`))],
      plugins: [
        rollupDts({
          respectExternal: true,
          compilerOptions: {
            paths: {
              ...Object.entries(resolve.paths.rollupTypes).reduce((obj, [key, value]) => {
                obj[key] = value.map((entry) => entry.replace('<typesDir>', typesPath));
                return obj;
              }, {}),
            },
          },
        }),
        {
          writeBundle() {
            const filesAndDirs = fs.readdirSync(typesPath);
            filesAndDirs.forEach((fileOrDir) => {
              if (path.basename(fileOrDir) !== path.basename(dtsOutput)) {
                fs.rmSync(path.join(typesPath, fileOrDir), { recursive: true });
              }
            });
            [
              dtsOutput.replace(tsDeclarationFileEnding, '.d.mts'),
              dtsOutput.replace(tsDeclarationFileEnding, '.d.cts'),
            ].forEach((additionalTypesFile) => {
              fs.writeFileSync(
                additionalTypesFile,
                `export * from './${path
                  .basename(dtsOutput)
                  .replace(tsDeclarationFileEnding, '.js')}';`
              );
            });
          },
        },
      ],
    },
  ];
};
