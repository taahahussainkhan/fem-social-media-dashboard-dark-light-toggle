// Initialize modules
const { src, dest, watch, series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();


// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
    }

// JavaScript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
    }

// Browsersync Tasks
function browsersyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: '.'
        },
        notify: { // Set to false to turn off.
            styles: {
                top: 'auto',
                bottom: '0'
            },
        },
    }); 
}
function browsersyncReload(cb) { // Reloads the browser with BrowserSync
    browserSync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], 
    series(scssTask, jsTask, browsersyncReload)
    );
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);