// TODO(vojta): generate this file.

import './spec/basic_functions.dart' as m1;
import './spec/class.dart' as m2;
import './spec/imports.dart' as m3;

import 'package:unittest/unittest.dart';

void main() {
  test('./spec/basic_functions.dart', () {
    m1.main();
  });

  test('./spec/class.dart', () {
    m2.main();
  });

  test('./spec/imports.dart', () {
    m3.main();
  });
}
