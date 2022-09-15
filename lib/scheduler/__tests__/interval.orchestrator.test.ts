import { IContainer, ProviderToken } from '../../container';
import { SchedulerContainer } from '../scheduler-container';
import { SchedulerFactory } from '../scheduler-factory';
import { SchedulerType } from '../scheduler-type.enum';
import { SchedulerOrchestrator } from '../scheduler.orchestrator';
import { SchedulerRegistry } from '../scheduler.registry';

class InMemoryContainer implements IContainer {
  private readonly services = new Map<ProviderToken, any>();

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(`${token.toString()} was not found`);
    }
    return this.services.get(token);
  }

  has(token: ProviderToken): boolean {
    return this.services.has(token);
  }

  set(token: ProviderToken, item: any): void {
    this.services.set(token, item);
  }

  reset(): void {
    this.services.clear();
  }
}

class IntervalOne {
  called = false;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    this.called = true;
    clearInterval(this.schedulerRegistry.getInterval('TEST'));
  }
}

const schedules = [
  {
    type: SchedulerType.INTERVAL,
    options: {
      timeout: 2500,
      name: 'TEST',
    },
    callback: IntervalOne.name,
  },
];

const container = new InMemoryContainer();
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
