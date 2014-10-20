var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    docco = require("gulp-docco"),
    qunit = require('gulp-qunit');

gulp.task('default', function() {
    gulp.src([
        './src/Core.js',
        './src/Settings.js',
        './src/Dom.js',
        './src/App.js',
        './src/Router.js',
        './src/Model.js',
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
    return gulp.src("./dist/air.js")
        .pipe(docco({
            // layout: 'linear'
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function() {
    return gulp.watch('src/*.js', ['default', 'doc']);
});

gulp.task('test', function() {
    return gulp.src('./test/tests.html')
        .pipe(qunit());
});