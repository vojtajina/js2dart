import {Provide} from './fixtures/annotations';

class Inject {}
class Bar {}

@Provide('Foo')
class Foo {
  @Inject
  constructor() {}
}

@Provide(Foo)
function baz() {}

function annotatedParams(@Inject(Foo) f, @Inject(Bar) b) {}
