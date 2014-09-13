// TODO(vojta): generate this file.

import './spec/functions.dart' as m1;
import './spec/classes.dart' as m2;
import './spec/imports.dart' as m3;
import './spec/annotations.dart' as m4;

import 'package:unittest/unittest.dart';

// For ./spec/annotations.dart
import 'dart:mirrors';
import './spec/fixtures/annotations.dart' as annotations;

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
}
