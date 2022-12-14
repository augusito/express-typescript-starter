import { TestingContainer } from '../../testing/testing-container';
import { Schedule } from '../interfaces';
import { SchedulerContainer } from '../scheduler-container';
import { SchedulerFactory } from '../scheduler-factory';
import { SchedulerType } from '../scheduler-type.enum';
import { SchedulerOrchestrator } from '../scheduler.orchestrator';
import { SchedulerRegistry } from '../scheduler.registry';

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

const schedules: Schedule[] = [
  {
    type: SchedulerType.CRON,
    cronTime: '* * * * * *',
    options: {
      name: 'EXECUTES_EVERY_SECOND',
    },
    target: CronOne.name,
  },
  {
    type: SchedulerType.CRON,
    cronTime: '*/30 * * * * *',
    options: {
      name: 'EXECUTES_EVERY_30_SECONDS',
    },
    target: CronTwo.name,
  },
  {
    type: SchedulerType.CRON,
    cronTime: '*/1 * * * *',
    options: {
      name: 'EXECUTES_EVERY_MINUTE',
    },
    target: CronThree.name,
  },
  {
    type: SchedulerType.CRON,
    cronTime: '0 0-23/1 * * *',
    options: {
      name: 'EXECUTES_EVERY_HOUR',
    },
    target: CronFour.name,
  },
];

const container = new TestingContainer();
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
