'use strict';
var through = require('through2');
var fs = require('fs');
var path = require('path');

module.exports = gulpTraceur;
gulpTraceur.reload = reload;

reload();

function gulpTraceur(options) {
  options = options || {};

  return through.obj(function (file, enc, done) {
    if (file.isNull()) {
      done();
      return;
    }

    if (file.isStream()) {
      throw new Error('gulp-traceur: Streaming not supported');
    }

    // create a new compiler everytime, so that
    // the sources of the compiler can be changed!
    var compiler = createCompiler(
      options,
      module.dirname
    );
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
};

function createCompiler(options, sourceRoot) {
  var CompilerBase = System.get(System.map['traceur']+'/src/Compiler').Compiler;

  // See traceur/src/NodeCompiler.js
  // Needed here as we want to be able to reload
  // traceur sources once they changed
  function NodeCompiler() {
    sourceRoot = sourceRoot || process.cwd();
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

  return new NodeCompiler();
}

// TODO: Also try to delete modules form require.cache
// and then require('traceur') again...
// Problem: don't know which modules to delete and which not...
function reload() {
  // see traceur/src/traceur.js
  var filename = '../traceur/bin/traceur.js';
  filename = path.join(path.dirname(module.filename), filename);
  var data = fs.readFileSync(filename, 'utf8');
  if (!data)
    throw new Error('Failed to import ' + filename);

  ('global', eval)(data);
}
