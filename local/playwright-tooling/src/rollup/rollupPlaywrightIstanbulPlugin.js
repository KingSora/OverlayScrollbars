import { createFilter } from '@rollup/pluginutils';
import istanbul from 'istanbul-lib-instrument';

export const rollupPlaywrightIstanbulPlugin = (options = {}) => {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'istanbul',
    transform(code, id) {
      if (!filter(id)) {
        return;
      }

      const instrumenter = istanbul.createInstrumenter({
        esModules: true,
        compact: true,
        produceSourceMap: true,
        autoWrap: true,
        preserveComments: true,
        ...options.instrumenterConfig,
      });

      const combinedSourceMap = this.getCombinedSourcemap();
      const instrumentedCode = instrumenter.instrumentSync(code, id, {
        ...combinedSourceMap,
        version: String(combinedSourceMap.version),
      });
      const sourceMap = instrumenter.lastSourceMap();

      return { code: instrumentedCode, map: { ...sourceMap, version: Number(sourceMap.version) } };
    },
  };
};
