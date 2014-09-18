'use strict';
var through = require('through2');

module.exports = function (options) {
  var compiler;
  options = options || {};
  if (!options.reload) {
    createCompiler();
  }

  return through.obj(function (file, enc, done) {
    if (file.isNull()) {
      done();
      return;
    }

    if (file.isStream()) {
      throw new Error('gulp-traceur: Streaming not supported');
    }

    var ret;
    if (options.reload) {
      delete options.reload;
      createCompiler();
    }

    try {
      var compiled = compiler.compile(file.contents.toString(), file.relative, file.relative);
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

  function createCompiler() {
    var traceur = require('traceur');
    compiler = new traceur.NodeCompiler(traceur.commonJSOptions(options));
  }
};
