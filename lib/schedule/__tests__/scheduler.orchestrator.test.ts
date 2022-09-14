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

class CronOne {
  callsCount = 0;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    ++this.callsCount;
    if (this.callsCount > 2) {
      const ref = this.schedulerRegistry.getCronJob('EXECUTES_EVERY_SECOND');
      ref?.stop();
    }
  }
}

class CronTwo {
  callsCount = 0;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    ++this.callsCount;
    if (this.callsCount === 1) {
      const ref = this.schedulerRegistry.getCronJob(
        'EXECUTES_EVERY_30_SECONDS',
      );
      ref?.stop();
    }
  }
}

class CronThree {
  callsCount = 0;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    ++this.callsCount;
    if (this.callsCount > 2) {
      const ref = this.schedulerRegistry.getCronJob('EXECUTES_EVERY_MINUTE');
      ref?.stop();
    }
  }
}

class CronFour {
  callsCount = 0;
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute() {
    ++this.callsCount;
    if (this.callsCount > 2) {
      const ref = this.schedulerRegistry.getCronJob('EXECUTES_EVERY_HOUR');
      ref?.stop();
    }
  }
}

const schedules = [
  {
    type: SchedulerType.CRON,
    options: {
      cronTime: '* * * * * *',
      name: 'EXECUTES_EVERY_SECOND',
    },
    callback: CronOne.name,
  },
  {
    type: SchedulerType.CRON,
    options: {
      cronTime: '*/30 * * * * *',
      name: 'EXECUTES_EVERY_30_SECONDS',
    },
    callback: CronTwo.name,
  },
  {
    type: SchedulerType.CRON,
    options: {
      cronTime: '*/1 * * * *',
      name: 'EXECUTES_EVERY_MINUTE',
    },
    callback: CronThree.name,
  },
  {
    type: SchedulerType.CRON,
    options: {
      cronTime: '0 0-23/1 * * *',
      name: 'EXECUTES_EVERY_HOUR',
    },
    callback: CronFour.name,
  },
];

const container = new InMemoryContainer();
container.set(SchedulerRegistry.name, new SchedulerRegistry());
container.set(CronOne.name, new CronOne(container.get(SchedulerRegistry.name)));
container.set(CronTwo.name, new CronTwo(container.get(SchedulerRegistry.name)));
container.set(
  CronThree.name,
  new CronThree(container.get(SchedulerRegistry.name)),
);
container.set(
  CronFour.name,
  new CronFour(container.get(SchedulerRegistry.name)),
);
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

const tock = (() => {
  return {
    useFakeTime() {
      jest.useFakeTimers({ now: 1663027200000 });
    },

    advanceTime(time = 0) {
      jest.advanceTimersByTime(time);
    },

    countTimers() {
      return jest.getTimerCount();
    },

    useRealTime() {
      jest.useRealTimers();
    },
  };
})();

describe('Cron', () => {
  let orchestrator: SchedulerOrchestrator;
  let registry: SchedulerRegistry;
  beforeEach(() => {
    registry = container.get(SchedulerRegistry.name);
    orchestrator = container.get(SchedulerOrchestrator.name);
  });
  afterEach(() => {
    Array.from(registry.getCronJobs().keys()).forEach((item) =>
      registry.removeCronJob(item),
    );
    tock.useRealTime();
  });

  it(`should schedule "cron"`, () => {
    const service = container.get<CronOne>(CronOne.name);
    expect(service.callsCount).toEqual(0);

    tock.useFakeTime();
    orchestrator.onApplicationBootstrap();

    tock.advanceTime(1000 * 3);
    expect(service.callsCount).toEqual(3);
  });

  it(`should return cron job by name`, () => {
    orchestrator.onApplicationBootstrap();
    expect(registry.getCronJob('EXECUTES_EVERY_SECOND')).not.toBeUndefined();
  });

  it(`should run "cron" once after 30 seconds`, () => {
    const service = container.get<CronTwo>(CronTwo.name);

    tock.useFakeTime();
    orchestrator.onApplicationBootstrap();
    const job = registry.getCronJob('EXECUTES_EVERY_30_SECONDS');

    expect(job.running).toBeTruthy();
    expect(service.callsCount).toEqual(0);

    tock.advanceTime(1000 * 30);
    expect(service.callsCount).toEqual(1);
    expect(job.lastDate()).toEqual(new Date('2022-09-13T00:00:30.000Z'));

    tock.advanceTime(1000);
    expect(job.running).toBeFalsy();
  });

  it(`should run "cron" 3 times every 60 seconds`, () => {
    const service = container.get<CronThree>(CronThree.name);

    tock.useFakeTime();
    expect(service.callsCount).toEqual(0);

    orchestrator.onApplicationBootstrap();
    const job = registry.getCronJob('EXECUTES_EVERY_MINUTE');

    tock.advanceTime(1000 * 60 * 3);
    expect(service.callsCount).toEqual(3);
    expect(job.lastDate()).toEqual(new Date('2022-09-13T00:03:00.000Z'));

    tock.advanceTime(1000);
    expect(job.running).toBeFalsy();
  });

  it(`should run "cron" 3 times every hour`, () => {
    const service = container.get<CronFour>(CronFour.name);

    tock.useFakeTime();
    expect(service.callsCount).toEqual(0);

    orchestrator.onApplicationBootstrap();
    const job = registry.getCronJob('EXECUTES_EVERY_HOUR');

    tock.advanceTime(1000 * 60 * 60 * 3);
    expect(service.callsCount).toEqual(3);
    expect(job.lastDate()).toEqual(new Date('2022-09-13T03:00:00.000Z'));

    tock.advanceTime(1000);
    expect(job.running).toBeFalsy();
  });

  it('should clean up cron jobs on application shutdown', () => {
    tock.useFakeTime();
    orchestrator.onApplicationBootstrap();
    expect(registry.getCronJobs().size).toBe(4);
    expect(tock.countTimers()).toBe(4);
    orchestrator.onApplicationShutdown();
    expect(registry.getCronJobs().size).toBe(0);
    expect(tock.countTimers()).toBe(0);
  });
});
