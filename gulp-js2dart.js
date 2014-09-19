var util = require('util');
var through = require('through2');
var HEADER = '// Compiled by js2dart\n' +
             '// Source file: %s\n\n';

var neededModuleNames = [
  'traceur',
  // TODO: automatically scan all files and require them!
  './build/js2dart/compiler',
  './build/js2dart/class_transformer',
  './build/js2dart/dart_writer',
  './build/js2dart/ast/class_field'
];

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
    neededModuleNames.forEach(require);

    var JS2DartCompiler = System.get('js2dart/compiler').EcmaScript6ToDartCompiler;
    compiler = new JS2DartCompiler();
  }

};
