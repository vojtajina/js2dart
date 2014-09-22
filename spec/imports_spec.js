import {Foo, Bar} from './foo';
// import {Foo as F} from './fixtures/foo';
import fooModule from './foo';


function main() {
  assert(Foo == 'FOO');
  assert(Bar == 'BAR');
  // assert(F == 'FOO');
  assert(fooModule.Foo == 'FOO');
  assert(fooModule.Bar == 'BAR');
}
