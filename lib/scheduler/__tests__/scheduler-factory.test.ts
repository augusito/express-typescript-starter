import { SchedulerContainer } from '../scheduler-container';
import { SchedulerFactory } from '../scheduler-factory';
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

const schedulerFactory = new SchedulerFactory(schedulerContainer);

describe('SchedulerContainer', () => {
  it('should resolve for correct class scheduler', () => {
    const scheduler = schedulerFactory.prepare(Foo);
    expect(scheduler).toBeInstanceOf(Foo);
    expect(scheduler.execute).toBeDefined();
  });

  it('should resolve for correct function scheduler', () => {
    const scheduler = schedulerFactory.prepare(fnBaz);
    expect(scheduler.execute).toBeDefined();
  });

  it('should resolve for correct scheduler class service', () => {
    const scheduler = schedulerFactory.prepare(Foo.name);
    expect(scheduler).toBeInstanceOf(Foo);
    expect(scheduler.execute).toBeDefined();
  });

  it('should resolve for correct scheduler function service', () => {
    const scheduler = schedulerFactory.prepare('BAZ');
    expect(scheduler.execute).toBeDefined();
  });

  it('should throw when given invalid sheduler', () => {
    expect(() => schedulerFactory.prepare(Bar)).toThrowError(
      "Invalid scheduler service (Bar); service doesn't provide the 'execute' method.",
    );
  });
});
