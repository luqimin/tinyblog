/**
 * Created by lqm on 11/02/2017.
 */

let path = require('path');
let webpack = require('webpack');
let prod = process.env.NODE_ENV === 'production';

require("babel-polyfill");

let plugins = [];
if (prod) {
    plugins = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false
        })
    ]
}

module.exports = {
    entry: {
        home: path.join(__dirname, 'dev/main/home.js'),
        article: path.join(__dirname, 'dev/main/article.js'),
    },
    // 输出配置
    output: {
        path: path.join(__dirname, 'www/static/js'),
        filename: "[name].js",
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: plugins,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [
                path.resolve(__dirname, "node_modules")
            ],
            loader: "babel-loader",
            options: {
                presets: ['es2015', 'stage-0']
            },
        }]
    }
};