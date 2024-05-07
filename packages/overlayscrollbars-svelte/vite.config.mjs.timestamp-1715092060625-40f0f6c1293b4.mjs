// vite.config.mjs
import { resolve } from "path";
import { defineConfig } from "file:///C:/Github/OverlayScrollbars/node_modules/vitest/dist/config.js";
import { esbuildResolve } from "file:///C:/Github/OverlayScrollbars/node_modules/rollup-plugin-esbuild-resolve/dist/index.js";
import { svelte } from "file:///C:/Github/OverlayScrollbars/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import rollupPluginPackageJson from "file:///C:/Github/OverlayScrollbars/local/rollup/src/plugins/packageJson.js";
import rollupPluginCopy from "file:///C:/Github/OverlayScrollbars/local/rollup/src/plugins/copy.js";
var __vite_injected_original_dirname = "C:\\Github\\OverlayScrollbars\\packages\\overlayscrollbars-svelte";
var vite_config_default = defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    outDir: "dist",
    lib: {
      entry: resolve(__vite_injected_original_dirname, "./src/overlayscrollbars-svelte")
    },
    rollupOptions: {
      external: ["overlayscrollbars"],
      output: [
        {
          format: "es",
          entryFileNames: "overlayscrollbars-svelte.esm.js"
        },
        {
          format: "es",
          entryFileNames: "overlayscrollbars-svelte.mjs"
        },
        {
          format: "cjs",
          entryFileNames: "overlayscrollbars-svelte.cjs.js"
        },
        {
          format: "cjs",
          entryFileNames: "overlayscrollbars-svelte.cjs"
        }
      ],
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
            peerDependencies,
            type
          }) => {
            return {
              name,
              version,
              type,
              description,
              author,
              license,
              homepage,
              bugs,
              repository,
              keywords,
              main: "overlayscrollbars-svelte.esm.js",
              module: "overlayscrollbars-svelte.esm.js",
              types: "overlayscrollbars-svelte.d.ts",
              svelte: "./overlayscrollbars-svelte.js",
              exports: {
                ".": {
                  svelte: {
                    types: "./overlayscrollbars-svelte.d.ts",
                    default: "./overlayscrollbars-svelte.js"
                  },
                  import: {
                    types: "./overlayscrollbars-svelte.d.mts",
                    default: "./overlayscrollbars-svelte.mjs"
                  },
                  require: {
                    types: "./overlayscrollbars-svelte.d.cts",
                    default: "./overlayscrollbars-svelte.cjs"
                  },
                  default: {
                    types: "./overlayscrollbars-svelte.d.ts",
                    default: "./overlayscrollbars-svelte.js"
                  }
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
  plugins: [esbuildResolve(), svelte(process.env.VITEST ? { hot: false } : {})]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcR2l0aHViXFxcXE92ZXJsYXlTY3JvbGxiYXJzXFxcXHBhY2thZ2VzXFxcXG92ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcR2l0aHViXFxcXE92ZXJsYXlTY3JvbGxiYXJzXFxcXHBhY2thZ2VzXFxcXG92ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZVxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0dpdGh1Yi9PdmVybGF5U2Nyb2xsYmFycy9wYWNrYWdlcy9vdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcclxuaW1wb3J0IHsgZXNidWlsZFJlc29sdmUgfSBmcm9tICdyb2xsdXAtcGx1Z2luLWVzYnVpbGQtcmVzb2x2ZSc7XHJcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xyXG5pbXBvcnQgcm9sbHVwUGx1Z2luUGFja2FnZUpzb24gZnJvbSAnQH5sb2NhbC9yb2xsdXAvcGx1Z2luL3BhY2thZ2VKc29uJztcclxuaW1wb3J0IHJvbGx1cFBsdWdpbkNvcHkgZnJvbSAnQH5sb2NhbC9yb2xsdXAvcGx1Z2luL2NvcHknO1xyXG5cclxuLy8gb25seSB1c2VkIGZvciB0ZXN0c1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9vdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUnKSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ292ZXJsYXlzY3JvbGxiYXJzJ10sXHJcbiAgICAgIG91dHB1dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZvcm1hdDogJ2VzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLmVzbS5qcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmb3JtYXQ6ICdlcycsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ292ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZS5tanMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZm9ybWF0OiAnY2pzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLmNqcy5qcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmb3JtYXQ6ICdjanMnLFxyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdvdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuY2pzJyxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgcm9sbHVwUGx1Z2luQ29weSh7IHBhdGhzOiBbJ1JFQURNRS5tZCcsICdDSEFOR0VMT0cubWQnXSB9KSxcclxuICAgICAgICByb2xsdXBQbHVnaW5QYWNrYWdlSnNvbih7XHJcbiAgICAgICAgICBqc29uOiAoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICB2ZXJzaW9uLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgYXV0aG9yLFxyXG4gICAgICAgICAgICBsaWNlbnNlLFxyXG4gICAgICAgICAgICBob21lcGFnZSxcclxuICAgICAgICAgICAgYnVncyxcclxuICAgICAgICAgICAgcmVwb3NpdG9yeSxcclxuICAgICAgICAgICAga2V5d29yZHMsXHJcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMsXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICB9KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICB2ZXJzaW9uLFxyXG4gICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgYXV0aG9yLFxyXG4gICAgICAgICAgICAgIGxpY2Vuc2UsXHJcbiAgICAgICAgICAgICAgaG9tZXBhZ2UsXHJcbiAgICAgICAgICAgICAgYnVncyxcclxuICAgICAgICAgICAgICByZXBvc2l0b3J5LFxyXG4gICAgICAgICAgICAgIGtleXdvcmRzLFxyXG4gICAgICAgICAgICAgIG1haW46ICdvdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuZXNtLmpzJyxcclxuICAgICAgICAgICAgICBtb2R1bGU6ICdvdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuZXNtLmpzJyxcclxuICAgICAgICAgICAgICB0eXBlczogJ292ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZS5kLnRzJyxcclxuICAgICAgICAgICAgICBzdmVsdGU6ICcuL292ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZS5qcycsXHJcbiAgICAgICAgICAgICAgZXhwb3J0czoge1xyXG4gICAgICAgICAgICAgICAgJy4nOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN2ZWx0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVzOiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuZC50cycsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJy4vb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgaW1wb3J0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXM6ICcuL292ZXJsYXlzY3JvbGxiYXJzLXN2ZWx0ZS5kLm10cycsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJy4vb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLm1qcycsXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmU6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlczogJy4vb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLmQuY3RzJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuY2pzJyxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVzOiAnLi9vdmVybGF5c2Nyb2xsYmFycy1zdmVsdGUuZC50cycsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJy4vb3ZlcmxheXNjcm9sbGJhcnMtc3ZlbHRlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLFxyXG4gICAgICAgICAgICAgIHNpZGVFZmZlY3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW2VzYnVpbGRSZXNvbHZlKCksIHN2ZWx0ZShwcm9jZXNzLmVudi5WSVRFU1QgPyB7IGhvdDogZmFsc2UgfSA6IHt9KV0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFYLFNBQVMsZUFBZTtBQUM3WSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHNCQUFzQjtBQUMvQixTQUFTLGNBQWM7QUFDdkIsT0FBTyw2QkFBNkI7QUFDcEMsT0FBTyxzQkFBc0I7QUFMN0IsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGdDQUFnQztBQUFBLElBQzVEO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsbUJBQW1CO0FBQUEsTUFDOUIsUUFBUTtBQUFBLFFBQ047QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGFBQWEsY0FBYyxFQUFFLENBQUM7QUFBQSxRQUN6RCx3QkFBd0I7QUFBQSxVQUN0QixNQUFNLENBQUM7QUFBQSxZQUNMO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0YsTUFBTTtBQUNKLG1CQUFPO0FBQUEsY0FDTDtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0EsTUFBTTtBQUFBLGNBQ04sUUFBUTtBQUFBLGNBQ1IsT0FBTztBQUFBLGNBQ1AsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGdCQUNQLEtBQUs7QUFBQSxrQkFDSCxRQUFRO0FBQUEsb0JBQ04sT0FBTztBQUFBLG9CQUNQLFNBQVM7QUFBQSxrQkFDWDtBQUFBLGtCQUNBLFFBQVE7QUFBQSxvQkFDTixPQUFPO0FBQUEsb0JBQ1AsU0FBUztBQUFBLGtCQUNYO0FBQUEsa0JBQ0EsU0FBUztBQUFBLG9CQUNQLE9BQU87QUFBQSxvQkFDUCxTQUFTO0FBQUEsa0JBQ1g7QUFBQSxrQkFDQSxTQUFTO0FBQUEsb0JBQ1AsT0FBTztBQUFBLG9CQUNQLFNBQVM7QUFBQSxrQkFDWDtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUFBLGNBQ0E7QUFBQSxjQUNBLGFBQWE7QUFBQSxZQUNmO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLGVBQWUsR0FBRyxPQUFPLFFBQVEsSUFBSSxTQUFTLEVBQUUsS0FBSyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUUsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
