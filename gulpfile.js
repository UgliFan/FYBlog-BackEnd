var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var plumber = require('gulp-plumber');
var webpack = require('gulp-webpack');

gulp.task('css', function() {
  return gulp.src(['src/Styles/common/*.scss'])
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest('static/css/common/'));
});

gulp.task('webpack', function() {
  return gulp.src(['./'])
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./static/'));
});

gulp.task('watch', ['publish'], function(){
  gulp.watch(['src/Styles/common/*.scss'], ['css']);
  gulp.watch(['src/**/*'], ['webpack']);
});

gulp.task('publish',['css', 'webpack']);