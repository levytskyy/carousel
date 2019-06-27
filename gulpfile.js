var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    minifyjs = require('gulp-js-minify'),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    prefix = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    validator = require('gulp-html'),
    clean = require('gulp-rimraf'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    proxy = require('http-proxy-middleware');

var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: 'Gulp',
        message: 'Error: <%= error.message %>'
    })
};

gulp.task('sass', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(plumber(plumberErrorHandler))
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(concat('bundle.style.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist'))
        .pipe(filesize());
});

gulp.task('scripts', function() {
    return gulp.src([
            './src/js/script.js',
        ])
        .pipe(concat('bundle.script.js'))
        .pipe(minifyjs())
        .pipe(gulp.dest('./dist'))
        .pipe(filesize());
});


gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});


gulp.task('clean',  function () {
    del(['build']);
});


gulp.task('run', function() {
    return gulp.src('dist')
        .pipe(webserver({
            fallback: 'index.html',
            livereload: false,
            open: true,
            port : 8000,
            host : 'localhost',
        }));
});

gulp.task('watch', function() {
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/js/script.js', ['scripts']);
    gulp.watch('./src/index.html', ['html']);
});

gulp.task('default', ['clean', 'sass', 'scripts', 'html',  'watch']);


