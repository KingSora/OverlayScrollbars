import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';

const projectRootPath = './packages';
const projectSrcDirectory = './src';
const projectDistDirectory = './dist';
const projectTypesDirectory = './types';
const projectEntry = 'index';

const outputs = [{
    extension: 'js',
    target: 'es5',
    ecmaVersion: 5,
}, {
    extension: 'esm.js',
    target: 'es6',
    ecmaVersion: 6,
}];

export default async (env) => {
    const {
        project,
        src = projectSrcDirectory,
        dist = projectDistDirectory,
        types = projectTypesDirectory,
        entry = projectEntry,
        production
    } = env;
    const projectPath = path.resolve(__dirname, projectRootPath, project);
    const srcPath = path.resolve(projectPath, src);
    const distPath = path.resolve(projectPath, dist);
    const typesPath = path.resolve(projectPath, types);
    const entryPath = path.resolve(srcPath, entry);

    const webpackConfigPath = path.resolve(projectPath, 'webpack.config.js');
    const packageJSONPath = path.resolve(projectPath, 'package.json');
    const tsconfigJSONPath = path.resolve(projectPath, 'tsconfig.json');
    const nodeModulesPath = path.resolve(projectPath, 'node_modules');

    const { default: webpackConfig } = await import(webpackConfigPath);
    const { compilerOptions } = await import(tsconfigJSONPath);
    const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

    const genConfigObj = ({ target, ecmaVersion, extension }, isFirstRun) => (merge({
        entry: entryPath,
        mode: production ? 'production' : 'development',
        devtool: 'source-map',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    sourceMap: true,
                    extractComments: false,
                    terserOptions: {
                        mangle: {
                            properties: {
                                regex: /^_/
                            }
                        },
                        output: {
                            beautify: true,
                            comments: false
                        }
                    },
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    ...compilerOptions,
                                    target: target,
                                    declarationDir: typesPath,
                                }
                            }
                        }
                    ]
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', 'jsx'],
            modules: [
                srcPath,
                nodeModulesPath,
                path.resolve(__dirname, 'node_modules'),
            ],
        },
        output: {
            filename: `${project}.${extension}`,
            path: distPath,
            ecmaVersion
        },
        externals: [
            ...Object.keys(devDependencies),
            ...Object.keys(peerDependencies)
        ],
        plugins: [
        ].concat(isFirstRun ? [new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: [
                distPath,
                typesPath
            ]
        })] : [])
    }, webpackConfig));

    return outputs.map((output, index) => genConfigObj(output, index === 0))
};