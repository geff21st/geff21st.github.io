const gulp = require('gulp');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync').create();

const scss_mask = 'scss/**/*.scss';
const js_dir = 'js';
const js_mask = js_dir + '/**/*.js';
const root_dir = 'www/';

gulp.task('sass-full', () => {
    // знак ! - означает "исключть маску"
    // ** – директория, * – любое название
    return gulp.src(['!scss/**/_*.scss', scss_mask])

        .pipe(sourcemaps.init())

        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
        }))

        .pipe(gulp.dest(root_dir + 'dist/css'))

        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../../scss'
        }))

        .pipe(gulp.dest(root_dir + 'dist/css'))
        ;
});


gulp.task('sass-min', () => {
    // знак ! - означает "исключть маску"
    // ** – директория, * – любое название
    return gulp.src(['!scss/**/_*.scss', scss_mask])

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))

        .pipe(cleanCSS())

        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../../scss'
        }))

        .pipe(gulp.dest(root_dir + 'dist/css'))

        .pipe(browserSync.stream({match: '**/*.css'}))
        ;
});

gulp.task('sass', gulp.parallel('sass-full', 'sass-min'));

gulp.task('scripts', function() {
    return gulp.src(js_mask)
    // .pipe(concat('all.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.', {}))
        .pipe(gulp.dest(root_dir + 'dist/js'))

        .pipe(browserSync.reload({stream:true}))
        ;
});

// gulp.task('watch', function() {
//     watch(js_mask, gulp.series('scripts'));
//     watch(scss_mask, gulp.series('sass'));
// });

gulp.task('server', function() {
    browserSync.init({
        server: "./www"
    });
    watch(js_mask, gulp.series('scripts'));
    watch(scss_mask, gulp.series('sass'));
    watch("www/**/*.html").on('change', browserSync.reload);
});

gulp.task('default',  gulp.parallel('sass', 'scripts', 'server'));
// gulp.task('default', gulp.parallel('sass', 'scripts', 'watch'));
