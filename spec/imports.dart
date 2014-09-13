// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/imports.js
// Fri Sep 12 2014 17:43:03 GMT-0700 (PDT)

import './fixtures/foo.dart' show Foo, Bar;
import './fixtures/foo.dart' as fooModule;
main() {
  assert(Foo == 'FOO');
  assert(Bar == 'BAR');
  assert(fooModule.Foo == 'FOO');
  assert(fooModule.Bar == 'BAR');
}
