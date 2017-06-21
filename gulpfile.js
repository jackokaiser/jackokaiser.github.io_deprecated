// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

'use strict';

var gulp    = require('gulp'),
  sass    = require('gulp-sass'),
  changed   = require('gulp-changed'),
  cleanCSS  = require('gulp-clean-css'),
  rtlcss    = require('gulp-rtlcss'),
  rename    = require('gulp-rename'),
  uglify    = require('gulp-uglify'),
  pump    = require('pump'),
  htmlhint    = require('gulp-htmlhint'),
  webserver = require('gulp-webserver');


// Gulp plumber error handler
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}


// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task('sass', function () {
  gulp.src('app/sass/**/*.scss')
    .pipe(changed('app/css/'))
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', sass.logError)
    .pipe(gulp.dest('app/css/'));
});


// Minify CSS
gulp.task('minify-css', function() {
  // Theme
    gulp.src(['app/css/layout.css', '!app/css/layout.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css/'));

    // RTL
    gulp.src(['app/css/layout-rtl.css', '!app/css/layout-rtl.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css/'));
});


// RTL CSS - Convert LTR CSS to RTL.
gulp.task('rtlcss', function () {
  gulp.src(['app/css/layout.css', '!app/css/layout.min.css', '!app/css/layout-rtl.css', '!app/css/layout-rtl.min.css'])
  .pipe(changed('app/css/'))
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest('app/css/'));
});


// Minify JS - Minifies JS
gulp.task('uglify', function (cb) {
    pump([
          gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js']),
          uglify(),
      rename({ suffix: '.min' }),
          gulp.dest('app/js/')
    ],
    cb
  );
});


// Htmlhint - Validate HTML
gulp.task('htmlhint', function() {
  gulp.src('app/*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
      .pipe(htmlhint.failReporter({ suppress: true }))
});


// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['sass', 'minify-css', 'rtlcss', 'uglify', 'htmlhint', 'watch', 'serve']);

// This handles watching and running tasks
gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/css/layout.css', ['minify-css']);
    gulp.watch('app/css/layout.css', ['rtlcss']);
    gulp.watch('app/js/**/*.js', ['uglify']);
    gulp.watch('app/*.html', ['htmlhint']);
});

gulp.task('serve', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});
