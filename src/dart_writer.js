var token = traceur.syntax.TokenType;
var OPEN_PAREN = token.OPEN_PAREN;
var CLOSE_PAREN = token.CLOSE_PAREN;
var IMPORT = token.IMPORT;
var SEMI_COLON = token.SEMI_COLON;
var STAR = token.STAR;
var OPEN_CURLY = token.OPEN_CURLY;
var CLOSE_CURLY = token.CLOSE_CURLY;
var COMMA = token.COMMA;
var FROM = traceur.syntax.PredefinedName.FROM;

var JavaScriptParseTreeWriter = traceur.outputgeneration.ParseTreeWriter;

function DartTreeWriter() {
  JavaScriptParseTreeWriter.call(this);

  // FUNCTIONS
  // - remove the "function" keyword
  this.visitFunction_ = function(tree) {
    this.writeAnnotations_(tree.annotations);
    if (tree.isAsyncFunction()) {
      this.write_(tree.functionKind);
    }

    if (tree.isGenerator()) {
      this.write_(tree.functionKind);
    }

    if (tree.name) {
      this.visitAny(tree.name);
    }

    this.write_(OPEN_PAREN);
    this.visitAny(tree.parameterList);
    this.write_(CLOSE_PAREN);
    this.writeTypeAnnotation_(tree.typeAnnotation);
    this.writeSpace_();
    this.visitAny(tree.body);
  };


  // EXPORTS
  // - ignore "export"
  this.visitExportDeclaration = function(tree) {
    this.writeAnnotations_(tree.annotations);
    this.visitAny(tree.declaration);
  };

  // visitExportDefault
  // visitNamedExport
  // visitExportSpecifier
  // visitExportSpecifierSet
  // visitExportStar


  // IMPORTS
  this.visitImportDeclaration = function(tree) {
    this.write_(IMPORT);
    this.writeSpace_();
    this.visitAny(tree.moduleSpecifier);

    if (tree.importClause.binding) {
      // Default import - import the entire module.
      // import foo from './bar';
      this.write_(' as ');
      this.visitAny(tree.importClause.binding);
    } else {
      // Regular - import list of members.
      // import {Foo, Bar} from './baz';
      this.visitAny(tree.importClause);
    }

    this.write_(SEMI_COLON);
  };

  // Translate './foo' -> './foo.dart'
  this.transformModuleUrl = function(url) {
    return "'" + url.substring(1, url.length - 1) + ".dart'";
  };

  this.visitModuleSpecifier = function(tree) {
    this.write_(this.transformModuleUrl(tree.token.value));
  };

  this.visitImportSpecifier = function(tree) {
    if (tree.name) {
      throw new Error('"as" syntax not supported');
    }
    this.visitAny(tree.binding);
  };

  this.visitImportSpecifierSet = function(tree) {
    if (tree.specifiers.type == STAR) {
      throw new Error('"*" syntax not supported');
    } else {
      this.write_(' show ');
      // TODO(vojta): no new line in the list
      this.writelnList_(tree.specifiers, COMMA);
    }
  };
}

DartTreeWriter.prototype = Object.create(JavaScriptParseTreeWriter.prototype);

module.exports = DartTreeWriter;
