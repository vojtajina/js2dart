var traceur = require('traceur');
var ParseTreeTransformer = traceur.codegeneration.ParseTreeTransformer;

// var token = traceur.syntax.TokenType;
// var CONSTRUCTOR = token.CONSTRUCTOR;

var parseToken = traceur.syntax.trees.ParseTreeType;
var PROPERTY_METHOD_ASSIGNMENT = parseToken.PROPERTY_METHOD_ASSIGNMENT;
var MEMBER_EXPRESSION = parseToken.MEMBER_EXPRESSION;
var THIS_EXPRESSION = parseToken.THIS_EXPRESSION;
var BINARY_EXPRESSION = 'BINARY_EXPRESSION';

var CONSTRUCTOR = traceur.syntax.PredefinedName.CONSTRUCTOR;


var Token = traceur.syntax.Token;
var propName = traceur.staticsemantics.propName;


var createVariableStatement = traceur.codegeneration.ParseTreeFactory.createVariableStatement;


// - rename constructor (name of the class - default Dart constructor)
// - collect fields (set in the constructor) and define them as class fields
function ClassTransformer() {
  ParseTreeTransformer.call(this);

  this.transformClassDeclaration = function(tree) {
    var className = tree.name.identifierToken.toString();

    var fields = [];
    tree.elements.forEach(function(elementTree) {
      if (elementTree.type === PROPERTY_METHOD_ASSIGNMENT &&
          !elementTree.isStatic &&
          propName(elementTree) === CONSTRUCTOR) {

        // Rename "constructor" to the class name.
        elementTree.name.literalToken.value = className;

        // Collect all fields, defined in the constructor.
        // TODO(vojta): Types
        elementTree.body.statements.forEach(function(statement) {
          if (statement.expression.type === BINARY_EXPRESSION &&
              statement.expression.operator.type === '=' &&
              statement.expression.left.type === MEMBER_EXPRESSION &&
              statement.expression.left.operand.type === THIS_EXPRESSION) {
            fields.push(createVariableStatement(new Token('var'), statement.expression.left.memberName.value, null));
          }
        });
      }
    });

    // Add the field definition to the begining of the class.
    tree.elements = fields.concat(tree.elements);

    return tree;
  };
}

ClassTransformer.prototype = Object.create(ParseTreeTransformer.prototype);

module.exports = ClassTransformer;
