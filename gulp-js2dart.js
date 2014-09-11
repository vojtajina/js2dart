var through = require('through2');
var JS2DartCompiler = require('./src/compiler');

module.exports = function js2dart() {
  var compiler = new JS2DartCompiler();

  return through.obj(function(file, _, done) {
    // TODO(vojta): Create new file object.
    file.contents = new Buffer(compiler.compile(file.contents.toString()));
    this.push(file);
    done();
  });
};
