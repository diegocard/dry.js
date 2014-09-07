var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize');

gulp.task('default', function() {
    gulp.src([
        './vendor/*.js',
        './src/Core.js',
        './src/Settings.js',
        './src/Dom.js',
        './src/App.js',
        './src/Router.js',
        './src/Controller.js',
        './src/Template.js',
        './src/View.js'
    ])
        .pipe(concat('air.js'))
        .pipe(gulp.dest('dist'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('air.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(filesize());
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['default']);
});