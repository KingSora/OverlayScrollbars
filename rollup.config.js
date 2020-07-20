import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

const projectRootPath = './packages';
const projectSrcDirectory = './src';
const projectDistDirectory = './dist';
const projectTypesDirectory = './types';
const projectEntry = 'index.ts';

export default async (config) => {
    const {
        'config-project': project,
        'config-src': src = projectSrcDirectory,
        'config-dist': dist = projectDistDirectory,
        'config-types': types = projectTypesDirectory,
        'config-entry': entry = projectEntry,
    } = config;

    const projectPath = path.resolve(__dirname, projectRootPath, project);
    const srcPath = path.resolve(projectPath, src);
    const distPath = path.resolve(projectPath, dist);
    const typesPath = path.resolve(projectPath, types);
    const entryPath = path.resolve(srcPath, entry);

    const packageJSONPath = path.resolve(projectPath, 'package.json');
    const tsconfigJSONPath = path.resolve(projectPath, 'tsconfig.json');
    const nodeModulesPath = path.resolve(projectPath, 'node_modules');

    const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

    return {
        input: entryPath,
        output: [
            {
                name: "OverlayScrollbars",
                format: 'esm',
                file: path.resolve(distPath, `${project}.js`),
                sourcemap: true,
                exports: 'default',
                plugins: [getBabelOutputPlugin({
                    presets: [['@babel/preset-env', {
                        modules: 'umd',
                        targets: {
                            ie: "11"
                        }

                    }]],
                    plugins: [["@babel/plugin-transform-modules-umd", {
                        globals: {
                            "jquery": "jQuery"
                        }
                    }]],
                    moduleId: "OverlayScrollbars"
                })]
            },
            {
                name: "OverlayScrollbars",
                format: 'esm',
                file: path.resolve(distPath, `${project}.esm.js`),
                sourcemap: true,
                exports: 'default',
                plugins: [getBabelOutputPlugin({
                    presets: [['@babel/preset-env', {
                        targets: {
                            chrome: "51",
                            firefox: "54",
                            safari: "11"
                        }
                    }]],
                })]
            },
            /*
            {
                name: "OverlayScrollbars",
                format: 'esm',
                file: path.resolve(distPath, `${project}.esm.min.js`),
                sourcemap: false,
                exports: 'default',
                plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env', { modules: 'umd' }] }), terser(),],
            }
            */
        ],
        external: [
            ...Object.keys(devDependencies),
            ...Object.keys(peerDependencies)
        ],
        plugins: [
            resolve({
                extensions: ['.ts', '.tsx', '.js', 'jsx'],
                customResolveOptions: {
                    moduleDirectory: [
                        srcPath,
                        nodeModulesPath,
                        path.resolve(__dirname, 'node_modules'),
                    ],
                }
            }),
            commonjs(),
            typescript({
                check: true,
                useTsconfigDeclarationDir: true,
                tsconfig: tsconfigJSONPath,
                tsconfigOverride: {
                    compilerOptions: {
                        target: 'es6',
                        sourceMap: true,
                        declaration: true,
                        declarationDir: typesPath,
                    },
                }
            }),
        ]
    }
};