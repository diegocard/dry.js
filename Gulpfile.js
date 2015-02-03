var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    size = require('gulp-size'),
    docco = require("gulp-docco"),
    qunit = require('gulp-qunit');

gulp.task('compile', function() {
    gulp.src([
        './src/Core.js',
        './src/Settings.js',
        './src/Utilities.js',
        './src/Dom.js',
        './src/App.js',
        './src/Router.js',
        './src/Model.js',
        './src/Controller.js',
        './src/Template.js',
        './src/View.js'
    ])
        .pipe(concat('dry.js'))
        .pipe(gulp.dest('dist'))
        .pipe(size({title: 'Unminified'}))
        .pipe(uglify())
        .pipe(rename('dry.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(size({title: 'Minified'}))
        .pipe(size({title: 'Minified and gzipped', gzip: true}));
});

gulp.task('doc', function() {
    return gulp.src("./dist/dry.js")
        .pipe(docco({
            // layout: 'linear'
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function() {
    return gulp.watch('src/*.js', ['default', 'doc']);
});

gulp.task('test', function() {
    return gulp.src('./test/UnitTests.html')
        .pipe(qunit());
});

gulp.task('default', ['compile', 'doc']);
