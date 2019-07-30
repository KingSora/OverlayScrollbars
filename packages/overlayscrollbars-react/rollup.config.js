import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const globals = { 
    'react': 'React',
    'overlayscrollbars': 'OverlayScrollbars'
};
const external = [...Object.keys(pkg.devDependencies), ...Object.keys(pkg.peerDependencies)];

export default {
    input: './src/index.ts',
    output: [
        {
        name: 'OverlayScrollbarsReact',
        globals: globals,
            file: pkg.main,
            format: 'umd',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true
        }
    ],
    external: external,
    plugins: [
        typescript({
            useTsconfigDeclarationDir : true
        }),
        resolve(),
        commonjs()
    ]
};