var Compiler = require('./src/compiler');

function compile(source) {
  var compiler = new Compiler();
  return compiler.compile(source);
};

module.exports = compile;
