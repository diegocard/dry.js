var gulp = require('gulp'),
    connect = require('gulp-connect'),
    remoteSrc = require('gulp-remote-src'),
    docco = require("gulp-docco");

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('doc', function() {
    return remoteSrc(['dry.js'], {
            base: 'https://cdn.rawgit.com/diegocard/dry.js/master/dist/',
        }).pipe(docco({
            // layout: 'linear'
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./css/*.css'], ['html']);
    gulp.watch(['./js/*.js'], ['html']);
});

gulp.task('default', ['connect', 'watch']);
