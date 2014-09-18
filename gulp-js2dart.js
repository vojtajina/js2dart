var util = require('util');
var through = require('through2');
var HEADER = '// Compiled by js2dart\n' +
             '// Source file: %s\n\n';
module.exports = function js2dart(options) {
  var compiler;
  if (!options || !options.reload) {
    createCompiler();
  }
  return through.obj(function(file, _, done) {
    if (options && options.reload) {
      createCompiler();
    }
    var compiled = compiler.compile(file.contents.toString(), file.path);
    // TODO(vojta): Create new file object.
    file.contents = new Buffer(util.format(HEADER, file.path) + compiled);
    this.push(file);
    done();
  });

  function createCompiler() {
    var JS2DartCompiler = require('./src/compiler');
    compiler = new JS2DartCompiler();
  }

};
