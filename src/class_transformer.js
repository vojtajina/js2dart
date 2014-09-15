var traceur = require('traceur');
var ParseTreeTransformer = traceur.codegeneration.ParseTreeTransformer;

// var token = traceur.syntax.TokenType;
// var CONSTRUCTOR = token.CONSTRUCTOR;

var parseToken = traceur.syntax.trees.ParseTreeType;
var PROPERTY_METHOD_ASSIGNMENT = parseToken.PROPERTY_METHOD_ASSIGNMENT;
var MEMBER_EXPRESSION = parseToken.MEMBER_EXPRESSION;
var THIS_EXPRESSION = parseToken.THIS_EXPRESSION;
var BINARY_EXPRESSION = 'BINARY_EXPRESSION';
var EQUAL_EQUAL_EQUAL = traceur.syntax.TokenType.EQUAL_EQUAL_EQUAL;
var CONSTRUCTOR = traceur.syntax.PredefinedName.CONSTRUCTOR;


var Token = traceur.syntax.Token;
var propName = traceur.staticsemantics.propName;


var createVariableStatement = traceur.codegeneration.ParseTreeFactory.createVariableStatement;
var createCallExpression = traceur.codegeneration.ParseTreeFactory.createCallExpression;
var createIdentifierExpression = traceur.codegeneration.ParseTreeFactory.createIdentifierExpression;
var createArgumentList = traceur.codegeneration.ParseTreeFactory.createArgumentList;


var ClassFieldParseTree = require('./ast/class_field');

// - rename constructor (name of the class - default Dart constructor)
// - collect fields (set in the constructor) and define them as class fields
function ClassTransformer() {
  ParseTreeTransformer.call(this);

  // Transform triple equals into identical() call.
  // TODO(vojta): move to a separate transformer
  this.transformBinaryExpression = function(tree) {
    if (tree.operator.type === EQUAL_EQUAL_EQUAL) {
      // a === b -> identical(a, b)
      return createCallExpression(createIdentifierExpression('identical'), createArgumentList([tree.left, tree.right]));
    }

    return tree;
  };

  this.transformClassDeclaration = function(tree) {
    var className = tree.name.identifierToken.toString();
    var argumentTypesMap = {};
    var fields = [];

    tree.elements.forEach(function(elementTree) {
      if (elementTree.type === PROPERTY_METHOD_ASSIGNMENT &&
          !elementTree.isStatic &&
          propName(elementTree) === CONSTRUCTOR) {

        // Store constructor argument types,
        // so that we can use them to set the types of simple-assigned fields.
        elementTree.parameterList.parameters.forEach(function(p) {
          argumentTypesMap[p.parameter.binding.identifierToken.value] = p.typeAnnotation;
        });

        // Rename "constructor" to the class name.
        elementTree.name.literalToken.value = className;

        // Collect all fields, defined in the constructor.
        elementTree.body.statements.forEach(function(statement) {
          if (statement.expression.type === BINARY_EXPRESSION &&
              statement.expression.operator.type === '=' &&
              statement.expression.left.type === MEMBER_EXPRESSION &&
              statement.expression.left.operand.type === THIS_EXPRESSION) {

            var typeAnnotation = argumentTypesMap[statement.expression.left.memberName.value] || null;
            fields.push(new ClassFieldParseTree(tree.location, statement.expression.left.memberName, typeAnnotation));
          }
        });
      }
    });

    // Add the field definitions to the begining of the class.
    tree.elements = fields.concat(tree.elements);

    return tree;
  };
}

ClassTransformer.prototype = Object.create(ParseTreeTransformer.prototype);

module.exports = ClassTransformer;
