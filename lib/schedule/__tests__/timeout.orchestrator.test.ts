import { IContainer, ProviderToken } from '../../container';
import { ScheduleContainer } from '../schedule-container';
import { ScheduleFactory } from '../schedule-factory';
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

class TimeoutOne {
  called = false;
  execute() {
    this.called = true;
  }
}

const schedules = [
  {
    type: SchedulerType.TIMEOUT,
    options: {
      timeout: 2500,
      name: 'TEST',
    },
    callback: TimeoutOne.name,
  },
];

const container = new InMemoryContainer();
container.set(SchedulerRegistry.name, new SchedulerRegistry());
container.set(TimeoutOne.name, new TimeoutOne());
container.set(ScheduleContainer.name, new ScheduleContainer(container));
container.set(
  ScheduleFactory.name,
  new ScheduleFactory(container.get(ScheduleContainer.name)),
);
container.set(
  SchedulerOrchestrator.name,
  new SchedulerOrchestrator(
    container.get(SchedulerRegistry.name),
    container.get(ScheduleFactory.name),
    schedules,
  ),
);

describe('Timeout', () => {
  let orchestrator: SchedulerOrchestrator;
  let registry: SchedulerRegistry;
  beforeEach(() => {
    registry = container.get(SchedulerRegistry.name);
    orchestrator = container.get(SchedulerOrchestrator.name);
    jest.useFakeTimers();
  });
  afterEach(() => {
    Array.from(registry.getTimeouts()).forEach((item) =>
      registry.removeTimeout(item),
    );
    jest.useRealTimers();
  });

  it(`should schedule "timeout"`, () => {
    const service = container.get<TimeoutOne>(TimeoutOne.name);
    orchestrator.onApplicationBootstrap();
    jest.runAllTimers();
    expect(service.called).toBeTruthy();
  });

  it(`should return timeout by name`, () => {
    orchestrator.onApplicationBootstrap();
    expect(registry.getTimeout('TEST')).not.toBeUndefined();
  });

  it('should clean up timeouts on application shutdown', () => {
    orchestrator.onApplicationBootstrap();
    expect(registry.getTimeouts().length).toBe(1);
    expect(jest.getTimerCount()).toBe(1);

    orchestrator.onApplicationShutdown();
    expect(registry.getTimeouts().length).toBe(0);
    expect(jest.getTimerCount()).toBe(0);
  });
});
