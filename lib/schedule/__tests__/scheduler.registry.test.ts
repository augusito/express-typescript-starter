import { CronJob } from 'cron';
import { SchedulerRegistry } from '../scheduler.registry';

describe('Cron', () => {
  const tock = (() => {
    let spy: jest.SpyInstance<number, []> = jest.fn();
    let mockedTime = 0;

    return {
      useFakeTime(time = 0) {
        mockedTime = time;
        spy.mockRestore();
        spy = jest.spyOn(Date, 'now').mockReturnValue(mockedTime);
        jest.useFakeTimers();
      },

      advanceTime(time = 0) {
        mockedTime = mockedTime + time;
        spy.mockReturnValue(mockedTime);
        jest.advanceTimersByTime(time);
      },

      useRealTime() {
        spy.mockRestore();
        jest.useRealTimers();
      },
    };
  })();

  let registry: SchedulerRegistry;

  beforeEach(() => {
    registry = new SchedulerRegistry();
  });

  afterEach(tock.useRealTime);

  it(`should add cron job`, () => {
    const newJob = new CronJob('* * * * * *', () => {});

    registry.addCronJob('EVERY_SECOND', newJob);
    expect(registry.getCronJob('EVERY_SECOND')).not.toBeUndefined();
  });

  it(`should return and start cron job`, () => {
    let callsCount = 0;
    const newJob = new CronJob('* * * * * *', () => {
      ++callsCount;
      if (callsCount > 2) {
        const ref = registry.getCronJob('EVERY_SECOND');
        ref?.stop();
      }
    });

    registry.addCronJob('EVERY_SECOND', newJob);
    const jobs = registry.getCronJobs();
    expect(jobs.get('EVERY_SECOND')).toEqual(newJob);

    const job = registry.getCronJob('EVERY_SECOND');
    expect(job).toBeDefined();
    expect(job.running).toBeUndefined();
    expect(callsCount).toEqual(0);

    tock.useFakeTime(Date.now());
    job.start();
    expect(job.running).toEqual(true);

    tock.advanceTime(3000);
    expect(callsCount).toEqual(3);
  });

  it(`should remove cron job`, () => {
    const newJob = new CronJob('* * * * * *', () => {});

    registry.addCronJob('EVERY_SECOND', newJob);
    let job = registry.getCronJob('EVERY_SECOND');
    expect(job).toBeDefined();

    registry.removeCronJob('EVERY_SECOND');
    try {
      job = registry.getCronJob('EVERY_SECOND');
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'No Cron Job was found with the given name (EVERY_SECOND).',
      );
    }
  });

  it('should throw when duplicate cron job', () => {
    const newJob = new CronJob('* * * * * *', () => {});

    registry.addCronJob('EVERY_SECOND', newJob);
    try {
      registry.addCronJob('EVERY_SECOND', newJob);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'Cron Job with the given name (EVERY_SECOND) already exists. Ignored.',
      );
    }
  });

  it('should return true for cron job', async () => {
    const newJob = new CronJob('* * * * * *', () => {});

    registry.addCronJob('EVERY_SECOND', newJob);
    expect(registry.doesExist('cron', 'EVERY_SECOND')).toEqual(true);
  });

  it('should return false for cron job', async () => {
    expect(registry.doesExist('cron', 'EVERY_SECOND')).toEqual(false);
  });
});

describe('Interval', () => {
  let registry: SchedulerRegistry;

  beforeEach(() => {
    registry = new SchedulerRegistry();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`should add interval`, async () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    expect(registry.getInterval('TEST')).not.toBeUndefined();
  });

  it(`should return and schedule interval`, async () => {
    let called = false;

    const intervalRef = setInterval(() => {
      called = true;
      clearInterval(registry.getInterval('TEST'));
    }, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    const intervals = registry.getIntervals();
    expect(intervals).toContain('TEST');

    const interval = registry.getInterval('TEST');
    expect(interval).toBeDefined();

    expect(called).toBeFalsy();
    jest.runAllTimers();
    expect(called).toBeTruthy();
  });

  it(`should remove interval`, () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    let interval = registry.getInterval('TEST');
    expect(interval).toBeDefined();

    registry.removeInterval('TEST');
    try {
      interval = registry.getInterval('TEST');
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'No Interval was found with the given name (TEST).',
      );
    }
  });

  it('should throw when duplicate interval', () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    try {
      registry.addInterval('TEST', intervalRef as unknown as number);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'Interval with the given name (TEST) already exists. Ignored.',
      );
    }
  });

  it('should return true for interval', async () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    expect(registry.doesExist('interval', 'TEST')).toEqual(true);
  });

  it('should return false for interval', async () => {
    expect(registry.doesExist('interval', 'TEST')).toEqual(false);
  });
});
