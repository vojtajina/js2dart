// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/types.js
// Fri Sep 12 2014 20:03:10 GMT-0700 (PDT)

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
}
