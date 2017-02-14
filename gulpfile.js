/**
 * Created by lqm on 12/02/2017.
 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const isProd = process.env.NODE_ENV === 'production' ? true : false;

let PATH = {
    js: ['src/**/index.js'],
    core: 'cache/*.js',
    res: 'src/**/*.{json,wxml,wxss}',
    dest: 'build',
    demoDest: 'demo/pages'
};
if (!isProd) {
    PATH = {
        js: 'src/**/*.js',
        res: 'src/**/*.{json,wxml,wxss}',
        dest: 'build',
        demoDest: 'demo/pages'
    }
}

let compressJs = function() {
    gulp.src(PATH.js)
        .pipe(gulp.dest(PATH.demoDest));
};
let taskArr = ['js', 'file', 'watch'];

if (isProd) {
    // 生产环境先打包core.js
    // 打包core成功后
    compressJs = function() {
        gulp.src(PATH.js)
            .pipe(babel({
                compact: false,
                presets: ['es2015']
            }))
            .pipe(uglify({
                mangle: true,
                compress: true
            }))
            //简单加密部分文件
            .pipe(js_obfuscator({}, ['**/encrypt/*.js', 'passport/index.js']))
            .pipe(gulp.dest(PATH.dest))
            .pipe(gulp.dest(PATH.demoDest));
    };

    gulp.task('core', function() {
        gulp.src(PATH.core)
            .pipe(gulp.dest(PATH.dest + '/passport'))
            .pipe(gulp.dest(PATH.demoDest + '/passport'));
    });

    taskArr = ['js', 'core', 'file'];
}

gulp.task('js', compressJs);

gulp.task('file', function() {
    gulp.src(PATH.res)
        .pipe(gulp.dest(PATH.dest))
        .pipe(gulp.dest(PATH.demoDest));
});

gulp.task('watch', function() {
    gulp.watch(PATH.js, ['js']);
    gulp.watch(PATH.res, ['file']);
});

gulp.task('default', taskArr, function() {
    // 将你的默认的任务代码放在这
});