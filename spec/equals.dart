// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/equals.js

same(a, b) {
  return identical(a, b);
}
main() {
  var obj = {};
  assert(same({}, {}) == false);
  assert(same(obj, obj) == true);
}
