class Bar {}

@Provide(Bar)
class Foo {
  @Inject
  constructor() {}
}

@Inject(Foo)
function baz() {}

function annotatedParams(@Inject(Foo) f, @Inject(Bar) b) {}
