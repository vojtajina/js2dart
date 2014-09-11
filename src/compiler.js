var traceur = require('traceur');
var NodeCompiler = traceur.NodeCompiler;

var ClassTransformer = require('./class_transformer');
var DartTreeWriter = require('./dart_writer');


function EcmaScript6ToDartCompiler() {
  var options = {
    annotations: true, // parse annotations
    types: true, // parse types
    script: false, // parse as a module
    filename: 'foo.js'
  };

  NodeCompiler.call(this, options);

  this.transform = function(tree) {
    var transformer = new ClassTransformer();
    return transformer.transformAny(tree);
  };

  this.write = function(tree, outputName) {
    var writer = new DartTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
  }
}

EcmaScript6ToDartCompiler.prototype = Object.create(NodeCompiler.prototype);

module.exports = EcmaScript6ToDartCompiler;
