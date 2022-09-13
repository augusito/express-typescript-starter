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

  it('should throw when duplicate detected', () => {
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
