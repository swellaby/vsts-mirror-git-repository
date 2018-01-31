'use strict';

var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var _root = path.resolve(__dirname);

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
};

module.exports = {
    entry: {
        'git-mirror/git-mirror-task': './src/git-mirror/git-mirror-task.js'
    },

    target: 'node',

    output: {
        path: root('.release'),
        filename: '[name].js'
    },

    resolve: {
        modules: [
            "node_modules"
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            { from: 'src' },
        ], {
            ignore: [
                '*.js',
                '*.js.map',
                '*.ts',
            ]
        })
    ],
};