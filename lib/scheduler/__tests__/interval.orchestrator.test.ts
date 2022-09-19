import { TestingContainer } from '../../testing/testing-container';
import { Schedule } from '../interfaces';
import { SchedulerContainer } from '../scheduler-container';
import { SchedulerFactory } from '../scheduler-factory';
import { SchedulerType } from '../scheduler-type.enum';
import { SchedulerOrchestrator } from '../scheduler.orchestrator';
import { SchedulerRegistry } from '../scheduler.registry';

class IntervalOne {
  called = false;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    this.called = true;
    clearInterval(this.schedulerRegistry.getInterval('TEST'));
  }
}

const schedules: Schedule[] = [
  {
    type: SchedulerType.INTERVAL,
    timeout: 2500,
    options: {
      name: 'TEST',
    },
    target: IntervalOne.name,
  },
];

const container = new TestingContainer();
container.set(SchedulerRegistry.name, new SchedulerRegistry());
container.set(
  IntervalOne.name,
  new IntervalOne(container.get(SchedulerRegistry.name)),
);
container.set(SchedulerContainer.name, new SchedulerContainer(container));
container.set(
  SchedulerFactory.name,
  new SchedulerFactory(container.get(SchedulerContainer.name)),
);
container.set(
  SchedulerOrchestrator.name,
  new SchedulerOrchestrator(
    container.get(SchedulerRegistry.name),
    container.get(SchedulerFactory.name),
    schedules,
  ),
);

describe('Interval', () => {
  let orchestrator: SchedulerOrchestrator;
  let registry: SchedulerRegistry;

  beforeEach(() => {
    registry = container.get(SchedulerRegistry.name);
    orchestrator = container.get(SchedulerOrchestrator.name);
    jest.useFakeTimers();
  });

  afterEach(() => {
    Array.from(registry.getIntervals()).forEach((item) =>
      registry.removeInterval(item),
    );
    jest.useRealTimers();
  });

  it(`should schedule "interval"`, () => {
    const service = container.get<IntervalOne>(IntervalOne.name);
    orchestrator.onApplicationBootstrap();
    jest.runAllTimers();
    expect(service.called).toBeTruthy();
  });

  it(`should return interval by name`, () => {
    orchestrator.onApplicationBootstrap();
    expect(registry.getInterval('TEST')).not.toBeUndefined();
  });

  it('should clean up intervals on application shutdown', () => {
    orchestrator.onApplicationBootstrap();
    expect(registry.getIntervals().length).toBe(1);
    expect(jest.getTimerCount()).toBe(1);

    orchestrator.onApplicationShutdown();
    expect(registry.getIntervals().length).toBe(0);
    expect(jest.getTimerCount()).toBe(0);
  });
});
