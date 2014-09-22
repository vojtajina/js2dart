import {CONSTRUCTOR, FROM} from 'traceur/src/syntax/PredefinedName';
import {EQUAL_EQUAL_EQUAL, OPEN_PAREN, CLOSE_PAREN, IMPORT, SEMI_COLON, STAR, OPEN_CURLY, CLOSE_CURLY, COMMA, AT, EQUAL} from 'traceur/src/syntax/TokenType';

import {ParseTreeWriter as JavaScriptParseTreeWriter} from 'traceur/src/outputgeneration/ParseTreeWriter';

export class DartTreeWriter extends JavaScriptParseTreeWriter {

  // VARIABLES - types
  // ```
  // var foo:bool = true;
  // ==>
  // bool foo = true;
  // ```
  visitVariableDeclarationList(tree) {
    // Write `var`, only if no type declaration.
    if (!tree.declarations[0].typeAnnotation) {
      this.write_(tree.declarationType);
      this.writeSpace_();
    }

    this.writeList_(tree.declarations, COMMA, true, 2);
  }

  visitVariableDeclaration(tree) {
    this.writeType_(tree.typeAnnotation);
    this.visitAny(tree.lvalue);

    if (tree.initializer !== null) {
      this.writeSpace_();
      this.write_(EQUAL);
      this.writeSpace_();
      this.visitAny(tree.initializer);
    }
  }

  // FUNCTIONS
  // - remove the "function" keyword
  // - type annotation infront
  visitFunction_(tree) {
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
  visitPropertyMethodAssignment(tree) {
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

  normalizeType_(typeName) {
    if (typeName === 'number') {
      return 'int';
    }

    if (typeName === 'boolean') {
      return 'bool';
    }

    if (typeName === 'string') {
      return 'String';
    }

    return typeName;
  }

  // FUNCTION/METHOD ARGUMENTS
  // - type infront of the arg name
  visitBindingElement(tree) {
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
  }

  visitClassField(tree) {
    this.writeType_(tree.typeAnnotation);

    if (!tree.typeAnnotation) {
      this.write_('var ');
    }

    this.write_(tree.identifier);
    this.write_(SEMI_COLON);
  }

  writeType_(typeAnnotation) {
    if (!typeAnnotation) {
      return;
    }

    // TODO(vojta): Figure out why `typeAnnotation` has different structure when used with a variable.
    // This should probably be fixed in Traceur.
    var typeName = typeAnnotation.typeToken && typeAnnotation.typeToken.value || (typeAnnotation.name && typeAnnotation.name.value) || null;

    if (!typeName) {
      return;
    }

    this.write_(this.normalizeType_(typeName));
    this.writeSpace_();
  }

  // EXPORTS
  // - ignore "export"
  visitExportDeclaration(tree) {
    this.writeAnnotations_(tree.annotations);
    this.visitAny(tree.declaration);
  }

  // visitExportDefault
  // visitNamedExport
  // visitExportSpecifier
  // visitExportSpecifierSet
  // visitExportStar


  // IMPORTS
  visitImportDeclaration(tree) {
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
  }

  // Translate './foo' -> './foo.dart'
  transformModuleUrl(url) {
    return "'" + url.substring(1, url.length - 1) + ".dart'";
  }

  visitModuleSpecifier(tree) {
    this.write_(this.transformModuleUrl(tree.token.value));
  }

  visitImportSpecifier(tree) {
    if (tree.name) {
      throw new Error('"as" syntax not supported');
    }
    this.visitAny(tree.binding);
  }

  visitImportSpecifierSet(tree) {
    if (tree.specifiers.type == STAR) {
      throw new Error('"*" syntax not supported');
    } else {
      this.write_(' show ');
      this.writeList_(tree.specifiers, COMMA, false);
    }
  }


  // ANNOTATIONS
  // TODO(vojta): this is just fixing a bug in Traceur, send a PR.
  visitAnnotation(tree) {
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

