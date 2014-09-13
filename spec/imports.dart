import './fixtures/foo.dart' show Foo, Bar;
import './fixtures/foo.dart' as fooModule;
main() {
  assert(Foo == 'FOO');
  assert(Bar == 'BAR');
  assert(fooModule.Foo == 'FOO');
  assert(fooModule.Bar == 'BAR');
}
