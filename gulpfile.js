"use strict";
var gulp = require('gulp');
var jshint = require('gulp-jshint');
//var spawn = require('child-process').spawn;
var node;

gulp.task('watch', function() {
  gulp.watch('*.js', ['default']);
});

function handleError(err) {
  console.log(err.toString());
  gulp.emit('end');
}


gulp.task('lint', function() {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('run', function() {
  return;
  /*if (node) node.kill();
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });*/
});

gulp.task('default', function() {
  gulp.start('lint', 'run');
});
