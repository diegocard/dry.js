var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    size = require('gulp-size'),
    header = require('gulp-header'),
    docco = require("gulp-docco"),
    qunit = require('gulp-qunit');

gulp.task('compile', function() {
    var heading = '/* (c) Diego Cardozo - licence: https://github.com/diegocard/dry.js/blob/master/LICENSE */\n';

    gulp.src([
        './src/Core.js',
        './src/Settings.js',
        './src/Utilities.js',
        './src/Dom.js',
        './src/App.js',
        './src/Router.js',
        './src/Model.js',
        './src/Filter.js',
        './src/Controller.js',
        './src/Template.js',
        './src/View.js',
        './node_modules/d.js/lib/D.min.js',
        './src/Promise.js',
    ])
        .pipe(concat('dry.js'))
        .pipe(header(heading))
        .pipe(gulp.dest('dist'))
        .pipe(size({title: 'Unminified'}))
        .pipe(uglify())
        .pipe(header(heading))
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
