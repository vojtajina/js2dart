var traceur = require('traceur');
var ParseTree = traceur.syntax.trees.ParseTree;

var CLASS_FIELD = 'CLASS_FIELD';

function ClassField(location, identifier, typeAnnotation) {
  this.location = location;
  this.identifier = identifier;
  this.typeAnnotation = typeAnnotation;
}

ClassField.prototype = Object.create(ParseTree.prototype);
ClassField.prototype.type = CLASS_FIELD;
ClassField.prototype.visit = function(visitor) {
  visitor.visitClassField(this);
};

module.exports = ClassField;
