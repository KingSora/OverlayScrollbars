import resolve from '@rollup/plugin-node-resolve';

const jsFilesDir = './dist/src'

module.exports = {
    input: `${jsFilesDir}/index.js`,
    output: {
        name: 'OverlayScrollbars',
        file: 'index.bundle.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
        strict: true
    },
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: [jsFilesDir, 'node_modules']
            }
        })
    ]
};