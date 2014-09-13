// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/classes.js
// Fri Sep 12 2014 17:43:03 GMT-0700 (PDT)

class Foo {
  var a;
  var b;
  Foo(a, b) {
    this.a = a;
    this.b = b;
  }
  sum() {
    return this.a + this.b;
  }
}
main() {
  var foo = new Foo(2, 3);
  assert(foo.a == 2);
  assert(foo.b == 3);
  assert(foo.sum() == 5);
}
