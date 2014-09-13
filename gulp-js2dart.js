var through = require('through2');
var JS2DartCompiler = require('./src/compiler');

module.exports = function js2dart() {
  var compiler = new JS2DartCompiler();

  return through.obj(function(file, _, done) {
    try {
      var compiled = compiler.compile(file.contents.toString(), file.path);
      // TODO(vojta): Create new file object.
      file.contents = new Buffer(compiled);
      this.push(file);
      done();
    } catch (errors) {
      errors.forEach(function(errorMsg) {
        console.error(errorMsg);
      });

      // This is lame, plugin should not kill the VM.
      // Unfortunately, Gulp sucks at dealing with errors.
      // TODO(vojta): use some plugin that handles this nicely.
      process.exit(1);
    }
  });
};
