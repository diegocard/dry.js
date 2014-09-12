var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    docco = require("gulp-docco");

gulp.task('default', function() {
    gulp.src([
        './src/Core.js',
        './src/Settings.js',
        './src/Dom.js',
        './src/App.js',
        './src/Router.js',
        './src/Controller.js',
        './src/Template.js',
        './src/View.js',
        './vendor/*.js'
    ])
        .pipe(concat('air.js'))
        .pipe(gulp.dest('dist'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('air.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(filesize());
});

gulp.task('doc', function() {
    gulp.src("./dist/air.js")
        .pipe(docco({
            layout: 'linear'
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['default', 'doc']);
});
