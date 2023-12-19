// vitest.config.mjs
import { mergeConfig } from "file:///C:/Github/OverlayScrollbars/packages/overlayscrollbars-solid/node_modules/vite/dist/node/index.js";
import vitestConfig from "file:///C:/Github/OverlayScrollbars/local/config/src/vitest.mjs";

// vite.config.mjs
import { resolve } from "node:path";
import ts from "file:///C:/Github/OverlayScrollbars/packages/overlayscrollbars-solid/node_modules/typescript/lib/typescript.js";
import { defineConfig } from "file:///C:/Github/OverlayScrollbars/packages/overlayscrollbars-solid/node_modules/vite/dist/node/index.js";
import { esbuildResolve } from "file:///C:/Github/OverlayScrollbars/node_modules/rollup-plugin-esbuild-resolve/dist/index.js";
import solidPlugin from "file:///C:/Github/OverlayScrollbars/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import rollupPluginPackageJson from "file:///C:/Github/OverlayScrollbars/local/rollup/src/plugins/packageJson.js";
import rollupPluginCopy from "file:///C:/Github/OverlayScrollbars/local/rollup/src/plugins/copy.js";
var __vite_injected_original_dirname = "C:\\Github\\OverlayScrollbars\\packages\\overlayscrollbars-solid";
var entry = resolve(__vite_injected_original_dirname, "src/overlayscrollbars-solid.ts");
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    outDir: "dist",
    lib: {
      entry,
      formats: ["es", "cjs"],
      name: "OverlayScrollbarsSolid",
      fileName: (format) => `overlayscrollbars-solid.${format}.js`
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "solid-js/store", "overlayscrollbars"],
      output: {
        globals: {
          overlayscrollbars: "OverlayScrollbarsGlobal"
        }
      },
      plugins: [
        rollupPluginCopy({ paths: ["README.md", "CHANGELOG.md"] }),
        rollupPluginPackageJson({
          json: ({
            name,
            version,
            description,
            author,
            license,
            homepage,
            bugs,
            repository,
            keywords,
            peerDependencies
          }) => {
            return {
              name,
              version,
              description,
              author,
              license,
              homepage,
              bugs,
              repository,
              keywords,
              main: "overlayscrollbars-solid.cjs.js",
              module: "overlayscrollbars-solid.es.js",
              types: "types/overlayscrollbars-solid.d.ts",
              exports: {
                ".": {
                  types: "./types/overlayscrollbars-solid.d.ts",
                  solid: "./source/overlayscrollbars-solid.js",
                  import: "./overlayscrollbars-solid.es.js",
                  browser: "./overlayscrollbars-solid.es.js",
                  require: "./overlayscrollbars-solid.cjs.js",
                  node: "./overlayscrollbars-solid.cjs.js"
                }
              },
              peerDependencies,
              sideEffects: false
            };
          }
        })
      ]
    }
  },
  plugins: [
    esbuildResolve(),
    solidPlugin({
      solid: {
        generate: "dom",
        hydratable: true
      }
    }),
    {
      name: "ts",
      closeBundle() {
        const program = ts.createProgram([entry], {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          jsx: ts.JsxEmit.Preserve,
          jsxImportSource: "solid-js",
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          outDir: `dist/source`,
          declarationDir: `dist/types`,
          declaration: true,
          allowJs: true
        });
        program.emit();
      }
    }
  ]
});

// vitest.config.mjs
var vitest_config_default = mergeConfig(
  {
    ...vite_config_default,
    resolve: {
      conditions: ["development", "browser"]
    }
  },
  {
    test: {
      ...vitestConfig.test,
      server: {
        deps: {
          inline: [/solid-testing-library/]
        }
      }
    }
  }
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5tanMiLCAidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcR2l0aHViXFxcXE92ZXJsYXlTY3JvbGxiYXJzXFxcXHBhY2thZ2VzXFxcXG92ZXJsYXlzY3JvbGxiYXJzLXNvbGlkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxHaXRodWJcXFxcT3ZlcmxheVNjcm9sbGJhcnNcXFxccGFja2FnZXNcXFxcb3ZlcmxheXNjcm9sbGJhcnMtc29saWRcXFxcdml0ZXN0LmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0dpdGh1Yi9PdmVybGF5U2Nyb2xsYmFycy9wYWNrYWdlcy9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC92aXRlc3QuY29uZmlnLm1qc1wiO2ltcG9ydCB7IG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2aXRlc3RDb25maWcgZnJvbSAnQH5sb2NhbC9jb25maWcvdml0ZXN0JztcclxuaW1wb3J0IHZpdGVDb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZy5tanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcoXHJcbiAge1xyXG4gICAgLi4udml0ZUNvbmZpZyxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgY29uZGl0aW9uczogWydkZXZlbG9wbWVudCcsICdicm93c2VyJ10sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGVzdDoge1xyXG4gICAgICAuLi52aXRlc3RDb25maWcudGVzdCxcclxuICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgZGVwczoge1xyXG4gICAgICAgICAgaW5saW5lOiBbL3NvbGlkLXRlc3RpbmctbGlicmFyeS9dLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH1cclxuKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxHaXRodWJcXFxcT3ZlcmxheVNjcm9sbGJhcnNcXFxccGFja2FnZXNcXFxcb3ZlcmxheXNjcm9sbGJhcnMtc29saWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXEdpdGh1YlxcXFxPdmVybGF5U2Nyb2xsYmFyc1xcXFxwYWNrYWdlc1xcXFxvdmVybGF5c2Nyb2xsYmFycy1zb2xpZFxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0dpdGh1Yi9PdmVybGF5U2Nyb2xsYmFycy9wYWNrYWdlcy9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgZXNidWlsZFJlc29sdmUgfSBmcm9tICdyb2xsdXAtcGx1Z2luLWVzYnVpbGQtcmVzb2x2ZSc7XG5pbXBvcnQgc29saWRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tc29saWQnO1xuaW1wb3J0IHJvbGx1cFBsdWdpblBhY2thZ2VKc29uIGZyb20gJ0B+bG9jYWwvcm9sbHVwL3BsdWdpbi9wYWNrYWdlSnNvbic7XG5pbXBvcnQgcm9sbHVwUGx1Z2luQ29weSBmcm9tICdAfmxvY2FsL3JvbGx1cC9wbHVnaW4vY29weSc7XG5cbmNvbnN0IGVudHJ5ID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvb3ZlcmxheXNjcm9sbGJhcnMtc29saWQudHMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sXG4gICAgICBuYW1lOiAnT3ZlcmxheVNjcm9sbGJhcnNTb2xpZCcsXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYG92ZXJsYXlzY3JvbGxiYXJzLXNvbGlkLiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydzb2xpZC1qcycsICdzb2xpZC1qcy93ZWInLCAnc29saWQtanMvc3RvcmUnLCAnb3ZlcmxheXNjcm9sbGJhcnMnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgb3ZlcmxheXNjcm9sbGJhcnM6ICdPdmVybGF5U2Nyb2xsYmFyc0dsb2JhbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICByb2xsdXBQbHVnaW5Db3B5KHsgcGF0aHM6IFsnUkVBRE1FLm1kJywgJ0NIQU5HRUxPRy5tZCddIH0pLFxuICAgICAgICByb2xsdXBQbHVnaW5QYWNrYWdlSnNvbih7XG4gICAgICAgICAganNvbjogKHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICB2ZXJzaW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBhdXRob3IsXG4gICAgICAgICAgICBsaWNlbnNlLFxuICAgICAgICAgICAgaG9tZXBhZ2UsXG4gICAgICAgICAgICBidWdzLFxuICAgICAgICAgICAgcmVwb3NpdG9yeSxcbiAgICAgICAgICAgIGtleXdvcmRzLFxuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcyxcbiAgICAgICAgICB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICB2ZXJzaW9uLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgYXV0aG9yLFxuICAgICAgICAgICAgICBsaWNlbnNlLFxuICAgICAgICAgICAgICBob21lcGFnZSxcbiAgICAgICAgICAgICAgYnVncyxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeSxcbiAgICAgICAgICAgICAga2V5d29yZHMsXG4gICAgICAgICAgICAgIG1haW46ICdvdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5janMuanMnLFxuICAgICAgICAgICAgICBtb2R1bGU6ICdvdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5lcy5qcycsXG4gICAgICAgICAgICAgIHR5cGVzOiAndHlwZXMvb3ZlcmxheXNjcm9sbGJhcnMtc29saWQuZC50cycsXG4gICAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnLic6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGVzOiAnLi90eXBlcy9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5kLnRzJyxcbiAgICAgICAgICAgICAgICAgIHNvbGlkOiAnLi9zb3VyY2Uvb3ZlcmxheXNjcm9sbGJhcnMtc29saWQuanMnLFxuICAgICAgICAgICAgICAgICAgaW1wb3J0OiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5lcy5qcycsXG4gICAgICAgICAgICAgICAgICBicm93c2VyOiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5lcy5qcycsXG4gICAgICAgICAgICAgICAgICByZXF1aXJlOiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zb2xpZC5janMuanMnLFxuICAgICAgICAgICAgICAgICAgbm9kZTogJy4vb3ZlcmxheXNjcm9sbGJhcnMtc29saWQuY2pzLmpzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLFxuICAgICAgICAgICAgICBzaWRlRWZmZWN0czogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZXNidWlsZFJlc29sdmUoKSxcbiAgICBzb2xpZFBsdWdpbih7XG4gICAgICBzb2xpZDoge1xuICAgICAgICBnZW5lcmF0ZTogJ2RvbScsXG4gICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHtcbiAgICAgIG5hbWU6ICd0cycsXG4gICAgICBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0oW2VudHJ5XSwge1xuICAgICAgICAgIHRhcmdldDogdHMuU2NyaXB0VGFyZ2V0LkVTTmV4dCxcbiAgICAgICAgICBtb2R1bGU6IHRzLk1vZHVsZUtpbmQuRVNOZXh0LFxuICAgICAgICAgIG1vZHVsZVJlc29sdXRpb246IHRzLk1vZHVsZVJlc29sdXRpb25LaW5kLk5vZGVKcyxcbiAgICAgICAgICBqc3g6IHRzLkpzeEVtaXQuUHJlc2VydmUsXG4gICAgICAgICAganN4SW1wb3J0U291cmNlOiAnc29saWQtanMnLFxuICAgICAgICAgIGFsbG93U3ludGhldGljRGVmYXVsdEltcG9ydHM6IHRydWUsXG4gICAgICAgICAgZXNNb2R1bGVJbnRlcm9wOiB0cnVlLFxuICAgICAgICAgIG91dERpcjogYGRpc3Qvc291cmNlYCxcbiAgICAgICAgICBkZWNsYXJhdGlvbkRpcjogYGRpc3QvdHlwZXNgLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGFsbG93SnM6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByb2dyYW0uZW1pdCgpO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNYLFNBQVMsbUJBQW1CO0FBQ2xaLE9BQU8sa0JBQWtCOzs7QUNEeVYsU0FBUyxl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
