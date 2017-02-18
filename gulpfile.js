'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean');
 
gulp.task('js', function () {
  gulp.src(['app/js/**/module.js', 'app/js/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

gulp.task('sass', function () {
  gulp.src('app/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('.tmp/css'));
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(['app/styles/**/*.scss'], ['sass']);
});

gulp.task('build', ['js', 'sass']);