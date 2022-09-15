import { InMemoryContainer } from './in-memory-container';

class Foo {
  execute() {}
}

class Bar {
  fail() {}
}

function baz() {}

const originalContainer = new InMemoryContainer();
originalContainer.set(Foo.name, new Foo());
originalContainer.set(Bar.name, new Bar());
originalContainer.set(baz.name, baz());
