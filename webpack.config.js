const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/Hyperfetch.ts',
    devtool: 'source-map',
    output: {
        library: {
            name: 'hypf',
            type: 'umd',
            umdNamedDefine: true,
        },
        path: path.resolve(__dirname, 'static'),
        filename: 'hyperfetch.js',
    },
    resolve: { extensions: ['.ts'] },
    module: {
        rules: [
        // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' }
        ]
    }
}