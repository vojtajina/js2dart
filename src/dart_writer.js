var token = traceur.syntax.TokenType;
var OPEN_PAREN = token.OPEN_PAREN;
var CLOSE_PAREN = token.CLOSE_PAREN;

var JavaScriptParseTreeWriter = traceur.outputgeneration.ParseTreeWriter;

function DartTreeWriter() {
  JavaScriptParseTreeWriter.call(this);

  this.visitFunction_ = function(tree) {
    this.writeAnnotations_(tree.annotations);
    if (tree.isAsyncFunction())
      this.write_(tree.functionKind);
    // this.write_(FUNCTION);
    if (tree.isGenerator())
      this.write_(tree.functionKind);

    if (tree.name) {
      // this.writeSpace_();
      this.visitAny(tree.name);
    }

    this.write_(OPEN_PAREN);
    this.visitAny(tree.parameterList);
    this.write_(CLOSE_PAREN);
    this.writeTypeAnnotation_(tree.typeAnnotation);
    this.writeSpace_();
    this.visitAny(tree.body);
  };
}

DartTreeWriter.prototype = Object.create(JavaScriptParseTreeWriter.prototype);

module.exports = DartTreeWriter;
