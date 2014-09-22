var util = require('util');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var gulpTraceur = require('./gulp-traceur');
var glob = require('glob');
var HEADER = '// Compiled by js2dart\n' +
             '// Source file: %s\n\n';

module.exports = js2dart;
js2dart.reloadModules = function() {
  loadModules(true);
};
js2dart.loadModules = loadModules;

function js2dart(options) {
  var lastLoadCounter = loadCounter;
  var lastCompiler = null;
  return through.obj(function(file, _, done) {
    var compiler = createCompilerIfNeeded();
    var compiled = compiler.compile(file.contents.toString(), file.path);
    // TODO(vojta): Create new file object.
    file.contents = new Buffer(util.format(HEADER, file.path) + compiled);
    this.push(file);
    done();
  });

  function createCompilerIfNeeded() {
    loadModules(false);
    if (!lastCompiler || lastLoadCounter !== loadCounter) {
      lastLoadCounter = loadCounter;
      var JS2DartCompiler = System.get('js2dart/compiler').EcmaScript6ToDartCompiler;
      lastCompiler = new JS2DartCompiler();
    }
    return lastCompiler;
  }
}

var loadCounter = 0;
function loadModules(reload) {
  if (System && System.get('js2dart/compiler') && !reload) {
    return;
  }
  // To reload the js2dart modules we need
  // to clear the registry. To do that we
  // reload the traceur module...
  gulpTraceur.loadModules(true);
  loadCounter++;
  var buildDir = __dirname + '/build/js2dart';
  var moduleNames = [].slice.call(glob.sync('**/*.js', {
    cwd: buildDir
  }));
  moduleNames.forEach(function(filename) {
    filename = path.join(buildDir, filename);
    var data = fs.readFileSync(filename, 'utf8');
    if (!data)
      throw new Error('Failed to import ' + filename);

    ('global', eval)(data);
  });
}