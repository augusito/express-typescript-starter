import { CronJob } from 'cron';
import { SchedulerRegistry } from '../scheduler.registry';

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

describe('SchedulerRegistry', () => {
  describe('Cron', () => {
    afterEach(tock.useRealTime);
    it(`should return and start dynamic cron job`, async () => {
      let dynamicCallsCount = 0;
      const registry = new SchedulerRegistry();

      const job = new CronJob('* * * * * *', () => {
        ++dynamicCallsCount;
        if (dynamicCallsCount > 2) {
          const ref = registry.getCronJob('dynamic');
          ref?.stop();
        }
      });

      registry.addCronJob('dynamic', job);
      const jobs = registry.getCronJobs();
      expect(jobs.get('dynamic')).toEqual(job);

      const dynamicJob = registry.getCronJob('dynamic');
      expect(dynamicJob).toBeDefined();
      expect(dynamicJob.running).toBeUndefined();

      tock.useFakeTime(Date.now());
      dynamicJob.start();
      expect(dynamicJob.running).toEqual(true);

      tock.advanceTime(3000);
      expect(dynamicCallsCount).toEqual(3);
    });
  });
});
