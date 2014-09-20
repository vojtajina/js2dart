var util = require('util');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var HEADER = '// Compiled by js2dart\n' +
             '// Source file: %s\n\n';

var neededModuleNames = [
  '../traceur/bin/traceur.js',
  // TODO: automatically scan all files and add them!
  './build/js2dart/compiler.js',
  './build/js2dart/class_transformer.js',
  './build/js2dart/dart_writer.js',
  './build/js2dart/ast/class_field.js'
];

module.exports = js2dart;
js2dart.reload = reload;

reload();

function js2dart(options) {
  return through.obj(function(file, _, done) {
    // create a new compiler everytime, so that
    // the sources of the compiler can be changed!
    var JS2DartCompiler = System.get('js2dart/compiler').EcmaScript6ToDartCompiler;
    var compiler = new JS2DartCompiler();
    var compiled = compiler.compile(file.contents.toString(), file.path);
    // TODO(vojta): Create new file object.
    file.contents = new Buffer(util.format(HEADER, file.path) + compiled);
    this.push(file);
    done();
  });
}

function reload() {
  neededModuleNames.forEach(function(filename) {
    filename = path.join(path.dirname(module.filename), filename);
    var data = fs.readFileSync(filename, 'utf8');
    if (!data)
      throw new Error('Failed to import ' + filename);

    ('global', eval)(data);
  });
}