function sum(a: number, b: number): number {
  return a + b;
}

function not(a: boolean): boolean {
  return !a;
}


class Foo {
  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  sum(): number {
    return this.a + this.b;
  }

  typedVariables() {
    // TODO(vojta): test this
    var foo:string = 'foo';
    var typed:bool, untyped;
    var oneTyped:string = 'one',
        another: bool = true;
  }
}

function main() {
  // TODO(vojta): test this better.
  var f = new Foo(1, 2);
  assert(f.sum() == 3);

  f.typedVariables();
}