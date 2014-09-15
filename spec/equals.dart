// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/equals.js
// Mon Sep 15 2014 12:44:15 GMT-0700 (PDT)

same(a, b) {
  return identical(a, b);
}
main() {
  var obj = {};
  assert(same({}, {}) == false);
  assert(same(obj, obj) == true);
}
