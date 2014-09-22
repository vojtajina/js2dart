var rename = require('gulp-rename');
var watch = require('gulp-watch');
var traceur = require('./gulp-traceur');
var js2dart = require('./gulp-js2dart');
var shell = require('gulp-shell');
var clean = require('gulp-rimraf');
var mergeStreams = require('event-stream').merge;
var ejs = require('gulp-ejs');
var glob = require('glob');

var baseDir = __dirname;
var traceurDir = baseDir+'/../traceur';
var buildDir = baseDir + '/build';

var paths = {
  traceurSrc: traceurDir+'/src/**/*.js',
  js2dartSrc: baseDir + '/src/**/*.js',
  specTranspile: baseDir + '/spec/**/*.js',
  specTemplates: baseDir + '/spec/**/*.template',
  specCopy: baseDir + '/spec/**/*.dart'
};
paths.specSrc = [paths.specTranspile, paths.specTemplates, paths.specCopy];

module.exports.install = install;
module.exports.paths = paths;

function install(gulp) {
  var runSequence = require('run-sequence').use(gulp);
  // -- traceur
  gulp.task('traceur/clean', shell.task(['cd '+traceurDir+' && make clean']));

  gulp.task('traceur/build', function() {
    return shell.task(
      ['cd '+traceurDir+' && make bin/traceur.js bin/traceur-runtime.js']
    )().on('end', traceur.reloadModules);
  });

  // -- js2dart

  var traceurJsOptions = {
    annotations: true, // parse annotations
    types: true, // parse types
    script: false, // parse as a module
    modules: 'register',
    typeAssertions: false,
    moduleName: true,
    referrer: 'js2dart'
  };

  gulp.task('js2dart/clean', function() {
    return gulp.src(buildDir, {read: false})
        .pipe(clean());
  });

  gulp.task('js2dart/build', function() {
    return gulp
      .src(paths.js2dartSrc)
      .pipe(traceur(traceurJsOptions))
      .pipe(gulp.dest(buildDir+'/js2dart'))
      .on('end', js2dart.reloadModules);
  });

  gulp.task('js2dart/test/build', function(done) {
    var transpileSrc = gulp
        .src(paths.specTranspile)
        .pipe(js2dart())
        .pipe(rename({extname: '.dart'}))
        .pipe(gulp.dest(buildDir+'/spec'));

    var copySrc = gulp.src(paths.specCopy).pipe(gulp.dest(buildDir+'/spec'));
    var result = mergeStreams(transpileSrc, copySrc);
    result.on('end', generateRunner);

    function generateRunner() {
      var builtSpecFiles = glob.sync('**/*_spec.dart', {
        cwd: buildDir+'/spec'
      });
      gulp.src(paths.specTemplates)
        .pipe(ejs({
          files: builtSpecFiles
        }))
        .pipe(rename(function(path) {
          path.basename = path.basename.replace(/\..*/g, '');
          path.extname = '.dart';
        }))
        .pipe(gulp.dest(buildDir+'/spec'))
        .on('end', done);
    }
  });

  gulp.task('js2dart/test/run', shell.task([
    'cd '+baseDir+' && dart --checked run_specs.dart'
  ]));

  gulp.task('js2dart/test', function() {
    return runSequence('js2dart/test/build', 'js2dart/test/run');
  });
}
