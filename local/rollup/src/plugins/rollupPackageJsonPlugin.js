import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const rollupPackageJsonPlugin = ({
  input = 'package.json',
  output = 'package.json',
  json,
} = {}) => {
  const resolvedInput = path.resolve(input);

  return {
    name: 'packageJson',
    async buildStart() {
      const inputPackageJson = (
        await import(pathToFileURL(resolvedInput), {
          with: { type: 'json' },
        })
      ).default;
      this.emitFile({
        type: 'asset',
        source: JSON.stringify(
          typeof json === 'function' ? json(inputPackageJson) : inputPackageJson,
          null,
          2
        ),
        fileName: output,
      });
    },
  };
};
