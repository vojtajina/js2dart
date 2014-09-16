// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/types.js

int sum(int a, int b) {
  return a + b;
}
bool not(bool a) {
  return !a;
}
class Foo {
  int a;
  int b;
  Foo(int a, int b) {
    this.a = a;
    this.b = b;
  }
  int sum() {
    return this.a + this.b;
  }
  typedVariables() {
    string foo = 'foo';
    bool typed;
    var untyped;
    string oneTyped = 'one';
    bool another = true;
  }
}
