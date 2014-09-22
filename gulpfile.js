var gulp = require('gulp');
var tasks = require('./gulp-tasks');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var mergeStreams = require('event-stream').merge;

tasks.install(gulp);

gulp.task('build', function() {
  return runSequence('traceur/build', 'js2dart/build');
});

gulp.task('test', ['build'], function() {
  return runSequence('js2dart/test');
});

gulp.task('watch', function() {
  var traceurWatch = watch(tasks.paths.traceurSrc, function(_, done) {
    runSequence('traceur/build', 'js2dart/build', 'js2dart/test', done);
  });
  var js2dartWatch = watch(tasks.paths.js2dartSrc, function(_, done) {
    runSequence('js2dart/build', 'js2dart/test', done);
  });
  var specWatch = watch(tasks.paths.specSrc, function(_, done) {
    runSequence('js2dart/test', done);
  });
  return mergeStreams(traceurWatch, js2dartWatch, specWatch);
});