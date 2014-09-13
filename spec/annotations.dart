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
