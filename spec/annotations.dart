// Compiled by js2dart
// Source file: /Users/vojta/Code/js2dart/spec/annotations.js
// Fri Sep 12 2014 17:43:03 GMT-0700 (PDT)

import './fixtures/annotations.dart' show Provide;
class Inject {}
class Bar {}
@Provide('Foo') 
class Foo {
  @Inject 
  Foo() {}
}
@Provide(Foo) 
baz() {}
annotatedParams(@Inject(Foo) f, @Inject(Bar) b) {}
