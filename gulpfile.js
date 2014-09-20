var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var traceur = require('./gulp-traceur');
var js2dart = require('./gulp-js2dart');
var shell = require('gulp-shell');
var clean = require('gulp-rimraf');
var runSequence = require('run-sequence');
var mergeStreams = require('event-stream').merge;
var ejs = require('gulp-ejs');
var glob = require('glob');

var baseDir = __dirname;
var traceurDir = baseDir+'/../traceur';
var traceurFiles = traceurDir+'/src/**/*.js';

install(gulp);
module.exports.install = install;

function install(gulp) {
  // -- traceur
  gulp.task('traceur/clean', shell.task(['cd '+traceurDir+' && make clean']));

  gulp.task('traceur/build', shell.task(
    ['cd '+traceurDir+' && make bin/traceur.js bin/traceur-runtime.js']
  ));

  // -- js2dart

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

  var srcFiles = baseDir + '/src/**/*.js';
  var specFiles = baseDir + '/spec/**/*.js';
  var specTemplateFiles = baseDir + '/spec/**/*.template';
  var copyFiles = baseDir + '/spec/**/*.dart';
  var buildDir = baseDir + '/build';

  gulp.task('js2dart/clean', function() {
    return gulp.src(buildDir, {read: false})
        .pipe(clean());
  });

  gulp.task('js2dart/build', ['traceur/build'], function() {
    return gulp
      .src(srcFiles)
      .pipe(traceur(traceurJsOptions))
      .pipe(gulp.dest(buildDir+'/js2dart'))
  });

  gulp.task('js2dart/test/build', function(done) {
    var transpileSrc = gulp
        .src(specFiles)
        .pipe(js2dart())
        .pipe(rename({extname: '.dart'}))
        .pipe(gulp.dest(buildDir+'/spec'));

    var copySrc = gulp.src(copyFiles).pipe(gulp.dest(buildDir+'/spec'));
    var result = mergeStreams(transpileSrc, copySrc);
    result.on('end', function() {
      var specFiles = glob.sync('**/*_spec.dart', {
        cwd: buildDir+'/spec'
      });
      gulp.src(specTemplateFiles)
        .pipe(ejs({
          files: specFiles
        }))
        .pipe(rename(function(path) {
          path.basename = path.basename.replace(/\..*/g, '');
          path.extname = '.dart';
        }))
        .pipe(gulp.dest(buildDir+'/spec'))
        .on('end', done);
    });
  });

  gulp.task('js2dart/test/run', shell.task([
    'cd '+baseDir+' && dart --checked run_specs.dart'
  ]));

  gulp.task('js2dart/test', ['js2dart/build'], function() {
    return runSequence('js2dart/test/build', 'js2dart/test/run');
  });

  // Needed so that gulp-js2dart and gulp-traceur pick up the newest changes
  gulp.task('js2dart/refreshRequireCache', function(done) {
    // TODO: This is not working right now / leads to additional errors
    // - also needs to clear the module cache in System
    // for (var prop in require.cache) {
    //   if (/js2dart/.test(prop) || /traceur\//.test(prop)) {
    //     delete require.cache[prop];
    //   }
    // }
    done();
  });

  // Note: will also watch traceur for changes!
  gulp.task('js2dart/watch', function() {
    // TODO: also execute some of Traceur's tests (but not all as they take a while...)
    return watch([traceurFiles, srcFiles, specFiles], function(_, done) {
      return runSequence('js2dart/refreshRequireCache', 'js2dart/test', done);
    });
  });
}