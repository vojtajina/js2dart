// TODO(vojta): generate this file.

import './spec/functions.dart' as m1;
import './spec/classes.dart' as m2;
import './spec/imports.dart' as m3;

import 'package:unittest/unittest.dart';

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
}
