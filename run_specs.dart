// TODO(vojta): generate this file.

import './build/spec/functions.dart' as m1;
import './build/spec/classes.dart' as m2;
import './build/spec/imports.dart' as m3;
import './build/spec/annotations.dart' as m4;
import './build/spec/equals.dart' as m5;
import './build/spec/types.dart' as m6;

import 'package:unittest/unittest.dart';

// For ./spec/annotations.dart
import 'dart:mirrors';
import './build/spec/fixtures/annotations.dart' as annotations;

void main() {
  test('./spec/functions.dart', () {
    m1.main();
  });

  test('./spec/classes.dart', () {
    m2.main();
  });

  test('./spec/imports.dart', () {
    m3.main();
  });

  test('./spec/annotations.dart', () {
    // Assert `Foo` class has `Provide` annotation.
    // TODO(vojta): test this more.
    List<InstanceMirror> metadata = reflectClass(m4.Foo).metadata;
    assert(metadata.length == 1);
    assert(metadata.first.reflectee is annotations.Provide);
  });

  test('./spec/equals.dart', () {
    m5.main();
  });

  test('./spec/types.dart', () {
    // TODO(vojta): test this better.
    var f = new m6.Foo(1, 2);
    assert(f.sum() == 3);

    f.typedVariables();
  });
}
