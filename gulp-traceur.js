'use strict';
var through = require('through2');
var fs = require('fs');
var path = require('path');

module.exports = gulpTraceur;
gulpTraceur.reloadModules = function() {
  loadModules(true);
};
gulpTraceur.loadModules = loadModules;

function gulpTraceur(options) {
  var lastLoadCounter = loadCounter;
  var lastCompiler = null;
  options = options || {};

  return through.obj(function (file, enc, done) {
    if (file.isNull()) {
      done();
      return;
    }

    if (file.isStream()) {
      throw new Error('gulp-traceur: Streaming not supported');
    }

    var compiler = createCompilerIfNeeded();
    var ret;
    try {
      var fileName = file.relative;
      if (options.referrer) {
        fileName = options.referrer + '/' + fileName;
      }
      var compiled = compiler.compile(file.contents.toString(), fileName, fileName);
      file.contents = new Buffer(compiled);
      this.push(file);
      done();
    } catch (errors) {
      if (errors.join) {
         throw new Error('gulp-traceur: '+errors.join('\n'));
      } else {
        throw errors;
      }
    }
  });

  function createCompilerIfNeeded() {
    loadModules(false);
    if (!lastCompiler || lastLoadCounter !== loadCounter) {
      lastLoadCounter = loadCounter;
      var CompilerBase = System.get(System.map['traceur']+'/src/Compiler').Compiler;
      var Compiler = createCompilerConstructor(CompilerBase);
      lastCompiler = new Compiler(options);
    }
    return lastCompiler;
  }
};

function createCompilerConstructor(CompilerBase) {
  // See traceur/src/NodeCompiler.js
  // Needed here as we want to be able to reload
  // traceur sources once they changed
  function NodeCompiler(options, sourceRoot) {
    var sourceRoot = sourceRoot || process.cwd();
    CompilerBase.call(this, options, sourceRoot);
  }

  NodeCompiler.prototype = {
    __proto__: CompilerBase.prototype,

    resolveModuleName: function(filename) {
      if (!filename)
        return;
      var moduleName = filename.replace(/\.js$/, '');
      return path.relative(this.sourceRoot, moduleName).replace(/\\/g,'/');
    },

    sourceName: function(filename) {
      return path.relative(this.sourceRoot, filename);
    }
  }

  return NodeCompiler;
}

var loadCounter = 0;
function loadModules(reload) {
  if (global.System && !reload) {
    return;
  }
  loadCounter++;
  // see traceur/src/traceur.js
  var filename = '../traceur/bin/traceur.js';
  filename = path.join(path.dirname(module.filename), filename);
  var data = fs.readFileSync(filename, 'utf8');
  if (!data)
    throw new Error('Failed to import ' + filename);

  ('global', eval)(data);
}
