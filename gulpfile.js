const gulp = require('gulp');
const babel = require('gulp-babel');
const rimraf = require('rimraf');

const SRC = 'src/**/*.js';
const DEST = 'lib';

gulp.task('clean', function(done) {
	rimraf(DEST, done);
});

gulp.task('src', ['clean'], function() {
	return gulp
		.src(SRC)
		.pipe(babel())
		.pipe(gulp.dest(DEST));
});

gulp.task('prepublish', ['src']);
