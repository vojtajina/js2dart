var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var traceur = require('./gulp-traceur');
var js2dart = require('./gulp-js2dart');
var shell = require('gulp-shell');
var clean = require('gulp-rimraf');
var runSequence = require('run-sequence');
var mergeStreams = require('event-stream').merge;

var traceurJsOptions = {
  annotations: true, // parse annotations
  types: true, // parse types
  script: false, // parse as a module
  modules: 'register',
  typeAssertions: false,
  moduleName: true,
  referrer: 'js2dart',
  reload: true
};

var baseDir = __dirname;
var srcFiles = baseDir + '/src/**/*.js';
var specFiles = baseDir + '/spec/**/*.js';
var fixtureFiles = baseDir + '/spec/**/*.dart';
var buildDir = baseDir + '/build';

gulp.task('js2dart/clean', function() {
  return gulp.src(buildDir, {read: false})
      .pipe(clean());
});

gulp.task('js2dart/build', function() {
  return gulp
    .src(srcFiles)
    .pipe(traceur(traceurJsOptions))
    .pipe(gulp.dest(buildDir+'/js2dart'))
});

gulp.task('js2dart/test/build', function() {
  var transpileSrc =
    gulp
      .src(specFiles)
      .pipe(js2dart())
      .pipe(rename({extname: '.dart'}))
      .pipe(gulp.dest(buildDir+'/spec'))

  var copySrc = gulp.src(fixtureFiles).pipe(gulp.dest(buildDir+'/spec'));
  return mergeStreams(transpileSrc, copySrc);
});

gulp.task('js2dart/test/run', shell.task([
  'cd '+baseDir+' && dart --checked run_specs.dart'
]));

gulp.task('js2dart/test', ['js2dart/build'], function() {
  return runSequence('js2dart/test/build', 'js2dart/test/run');
});

gulp.task('js2dart/watch', function() {
  watch([srcFiles, specFiles], function(_, done) {
    runSequence('js2dart/test', done);
  });
});
