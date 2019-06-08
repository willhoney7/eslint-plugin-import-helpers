const gulp = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');

const SRC = 'src/**/?(*.js|*.ts)';
const DEST = 'lib';
const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function(done) {
	rimraf(DEST, done);
});

gulp.task('src', ['clean'], function() {
	return gulp
		.src(SRC)
		.pipe(tsProject())
		.pipe(gulp.dest(DEST));
});

gulp.task('prepublish', ['src']);
