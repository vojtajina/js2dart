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
var AT = token.AT;

var JavaScriptParseTreeWriter = traceur.outputgeneration.ParseTreeWriter;


function DartTreeWriter() {
  JavaScriptParseTreeWriter.call(this);

  // FUNCTIONS
  // - remove the "function" keyword
  // - type annotation infront
  this.visitFunction_ = function(tree) {
    this.writeAnnotations_(tree.annotations);
    if (tree.isAsyncFunction()) {
      this.write_(tree.functionKind);
    }

    if (tree.isGenerator()) {
      this.write_(tree.functionKind);
    }

    if (tree.name) {
      this.writeType_(tree.typeAnnotation);
      this.visitAny(tree.name);
    }

    this.write_(OPEN_PAREN);
    this.visitAny(tree.parameterList);
    this.write_(CLOSE_PAREN);
    this.writeSpace_();
    this.visitAny(tree.body);
  };

  // Class methods.
  // - type annotation infront
  this.visitPropertyMethodAssignment = function (tree) {
    this.writeAnnotations_(tree.annotations);

    if (tree.isStatic) {
      this.write_(STATIC);
      this.writeSpace_();
    }

    if (tree.isGenerator()) {
      this.write_(STAR);
    }

    if (tree.isAsyncFunction()) {
      this.write_(ASYNC);
    }

    this.writeType_(tree.typeAnnotation);
    this.visitAny(tree.name);
    this.write_(OPEN_PAREN);
    this.visitAny(tree.parameterList);
    this.write_(CLOSE_PAREN);
    this.writeSpace_();
    this.visitAny(tree.body);
  }

  this.normalizeType_ = function(typeName) {
    if (typeName === 'number') {
      return 'int';
    }

    if (typeName === 'boolean') {
      return 'bool';
    }

    return typeName;
  };

  // FUNCTION/METHOD ARGUMENTS
  // - type infront of the arg name
  this.visitBindingElement = function(tree) {
    // TODO(vojta): This is awful, just copy/pasted from Traceur,
    // we should still clean it up.
    var typeAnnotation = this.currentParameterTypeAnnotation_;
    // resetting type annotation so it doesn't filter down recursively
    this.currentParameterTypeAnnotation_ = null;

    this.writeType_(typeAnnotation);
    this.visitAny(tree.binding);

    if (tree.initializer) {
      this.writeSpace_();
      this.write_(EQUAL);
      this.writeSpace_();
      this.visitAny(tree.initializer);
    }
  };

  this.visitClassField = function(tree) {
    this.writeType_(tree.typeAnnotation);

    if (!tree.typeAnnotation) {
      this.write_('var ');
    }

    this.write_(tree.identifier);
    this.write_(SEMI_COLON);
  };

  this.writeType_ = function(typeAnnotation) {
    if (!typeAnnotation) {
      return;
    }

    this.write_(this.normalizeType_(typeAnnotation.typeToken.value));
    this.writeSpace_();
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
      this.writeList_(tree.specifiers, COMMA, false);
    }
  };


  // ANNOTATIONS
  // TODO(vojta): this is just fixing a bug in Traceur, send a PR.
  this.visitAnnotation = function(tree) {
    this.write_(AT);
    this.visitAny(tree.name);

    if (tree.args !== null) {
      this.write_(OPEN_PAREN);
      this.writeList_(tree.args.args, COMMA, false);
      this.write_(CLOSE_PAREN);
    }

    this.writeSpace_()
  }
}

DartTreeWriter.prototype = Object.create(JavaScriptParseTreeWriter.prototype);

module.exports = DartTreeWriter;
