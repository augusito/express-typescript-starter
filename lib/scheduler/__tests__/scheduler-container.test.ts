import { Scheduler } from '../interfaces';
import { SchedulerContainer } from '../scheduler-container';
import { InMemoryContainer } from './in-memory-container';

class Foo {
  execute() {}
}

class Bar {
  fail() {}
}

function fnBaz() {}

const originalContainer = new InMemoryContainer();
originalContainer.set(Foo.name, new Foo());
originalContainer.set(Bar.name, new Bar());
originalContainer.set('BAZ', fnBaz);

const schedulerContainer = new SchedulerContainer(originalContainer);

describe('SchedulerContainer', () => {
  it('should resolve for correct scheduler class service', () => {
    const foo = schedulerContainer.get<Scheduler>(Foo.name);
    expect(foo).toBeInstanceOf(Foo);
    expect(foo.execute).toBeDefined();
  });

  it('should resolve for correct scheduler function service', () => {
    const baz = schedulerContainer.get<Scheduler>('BAZ');
    expect(baz.execute).toBeDefined();
  });

  it('should throw when missing sheduler service', () => {
    expect(() => schedulerContainer.get(<any>'blah')).toThrowError(
      'Cannot fetch scheduler service ("blah"); service not registered, or does not resolve to a callable.',
    );
  });

  it('should throw when given invalid sheduler service', () => {
    expect(() => schedulerContainer.get(Bar.name)).toThrowError(
      "Invalid scheduler service (\"Bar\"); service doesn't provide the 'execute' method.",
    );
  });
});
