import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

const projectRootPath = "./packages";
const projectSrcDirectory = "./src";
const projectDistDirectory = "./dist";
const projectTypesDirectory = "./types";
const projectEntry = "index.ts";

const umdTargets = {
  ie: "11",
};
const esmTargets = {
  chrome: "51",
  firefox: "54",
  safari: "11",
};

export default async (config) => {
  const {
    "config-project": project,
    "config-src": src = projectSrcDirectory,
    "config-dist": dist = projectDistDirectory,
    "config-types": types = projectTypesDirectory,
    "config-entry": entry = projectEntry,
  } = config;

  const projectPath = path.resolve(__dirname, projectRootPath, project);
  const srcPath = path.resolve(projectPath, src);
  const distPath = path.resolve(projectPath, dist);
  const typesPath = path.resolve(projectPath, types);
  const entryPath = path.resolve(srcPath, entry);

  const packageJSONPath = path.resolve(projectPath, "package.json");
  const tsconfigJSONPath = path.resolve(projectPath, "tsconfig.json");
  const nodeModulesPath = path.resolve(projectPath, "node_modules");
  const buildConfigPath = path.resolve(projectPath, "build.config.json");

  const { minVersions, umd, esm } = await import(buildConfigPath);
  const { devDependencies = {}, peerDependencies = {} } = await import(
    packageJSONPath
  );

  const umdOutputBabelConfig = {
    allowAllFormats: true,
    presets: [
      [
        "@babel/preset-env",
        {
          //modules: "umd",
          targets: umdTargets,
          exclude: ["@babel/plugin-transform-typeof-symbol"],
        },
      ],
    ],
    /*
     * for umd transforms with babel.
     * problem: browser global is OverlayScrollbars.default
     *
     * moduleId: umd.name,
     * plugins: [
     *   "add-module-exports",
     *   [
     *     "@babel/plugin-transform-modules-umd",
     *     {
     *       globals: umd.globals,
     *     },
     *   ],
     * ],
     */
  };

  const esmOutputBabelConfig = {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: esmTargets,
        },
      ],
    ],
  };

  const mainOutputArray = [
    {
      format: "umd",
      name: umd.name,
      globals: umd.globals,
      file: path.resolve(distPath, `${project}.js`),
      sourcemap: umd.sourcemap || true,
      plugins: [getBabelOutputPlugin(umdOutputBabelConfig)],
    },
    {
      format: "esm",
      file: path.resolve(distPath, `${project}.esm.js`),
      sourcemap: esm.sourcemap || true,
      plugins: [getBabelOutputPlugin(esmOutputBabelConfig)],
    },
  ];

  return {
    input: entryPath,
    output: mainOutputArray.concat(
      minVersions
        ? mainOutputArray.map((outputObj) => ({
            ...outputObj,
            file: outputObj.file.replace(".js", ".min.js"),
            sourcemap: false,
            plugins: [...(outputObj.plugins || []), terser()],
          }))
        : []
    ),
    external: [
      ...Object.keys(devDependencies),
      ...Object.keys(peerDependencies),
    ],
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js", "jsx"],
        customResolveOptions: {
          moduleDirectory: [
            srcPath,
            nodeModulesPath,
            path.resolve(__dirname, "node_modules"),
          ],
        },
      }),
      commonjs(),
      typescript({
        check: true,
        useTsconfigDeclarationDir: true,
        tsconfig: tsconfigJSONPath,
        tsconfigOverride: {
          compilerOptions: {
            target: "es6",
            sourceMap: true,
            declaration: true,
            declarationDir: typesPath,
          },
        },
      }),
    ],
  };
};
