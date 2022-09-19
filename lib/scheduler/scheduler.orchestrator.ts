import { CronJob } from 'cron';
import { v4 } from 'uuid';
import {
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '../application/interfaces';
import { CronOptions, Schedule } from './interfaces';
import { SchedulerFactory } from './scheduler-factory';
import { SchedulerType } from './scheduler-type.enum';
import { SchedulerRegistry } from './scheduler.registry';

type CronJobHost = {
  options: CronOptions & Record<'cronTime', string | Date | any>;
};
type TargetHost = { target: Function };
type TimeoutHost = { timeout: number };
type RefHost<T> = { ref?: T };

type CronJobOptions = TargetHost & CronJobHost & RefHost<CronJob>;
type IntervalOptions = TargetHost & TimeoutHost & RefHost<number>;
type TimeoutOptions = TargetHost & TimeoutHost & RefHost<number>;

export class SchedulerOrchestrator
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly cronJobs: Record<string, CronJobOptions> = {};
  private readonly intervals: Record<string, IntervalOptions> = {};
  private readonly timeouts: Record<string, TimeoutOptions> = {};

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly ScheduleFactory: SchedulerFactory,
    schedules: Schedule[] = [],
  ) {
    this.init(schedules);
  }

  init(schedules: Schedule[]) {
    schedules.forEach((schedule: Schedule) => {
      const { type, options } = schedule;
      switch (type) {
        case SchedulerType.CRON: {
          const prototype = this.ScheduleFactory.prepare(schedule.target);
          return this.addCron(prototype.execute.bind(prototype), {
            ...options,
            cronTime: schedule.cronTime,
          });
        }
        case SchedulerType.TIMEOUT: {
          const prototype = this.ScheduleFactory.prepare(schedule.target);
          return this.addTimeout(
            prototype.execute.bind(prototype),
            schedule.timeout,
            options.name,
          );
        }
        case SchedulerType.INTERVAL: {
          const prototype = this.ScheduleFactory.prepare(schedule.target);
          return this.addInterval(
            prototype.execute.bind(prototype),
            schedule.timeout,
            options.name,
          );
        }
      }
    });
  }

  onApplicationBootstrap() {
    this.mountCron();
    this.mountIntervals();
    this.mountTimeouts();
  }

  onApplicationShutdown() {
    this.closeCronJobs();
    this.clearIntervals();
    this.clearTimeouts();
  }

  mountCron() {
    const cronKeys = Object.keys(this.cronJobs);
    cronKeys.forEach((key) => {
      const { options, target } = this.cronJobs[key];
      const cronJob = new CronJob(
        options.cronTime,
        target as any,
        undefined,
        false,
        options.timeZone,
        undefined,
        false,
        options.utcOffset,
        options.unrefTimeout,
      );
      cronJob.start();

      this.cronJobs[key].ref = cronJob;
      this.schedulerRegistry.addCronJob(key, cronJob);
    });
  }

  mountIntervals() {
    const intervalKeys = Object.keys(this.intervals);
    intervalKeys.forEach((key) => {
      const options = this.intervals[key];
      const intervalRef = setInterval(options.target, options.timeout);

      options.ref = intervalRef;
      this.schedulerRegistry.addInterval(key, intervalRef);
    });
  }

  mountTimeouts() {
    const timeoutKeys = Object.keys(this.timeouts);
    timeoutKeys.forEach((key) => {
      const options = this.timeouts[key];
      const timeoutRef = setTimeout(options.target, options.timeout);

      options.ref = timeoutRef;
      this.schedulerRegistry.addTimeout(key, timeoutRef);
    });
  }

  closeCronJobs() {
    Array.from(this.schedulerRegistry.getCronJobs().keys()).forEach((key) =>
      this.schedulerRegistry.removeCronJob(key),
    );
  }

  clearIntervals() {
    this.schedulerRegistry
      .getIntervals()
      .forEach((key) => this.schedulerRegistry.removeInterval(key));
  }

  clearTimeouts() {
    this.schedulerRegistry
      .getTimeouts()
      .forEach((key) => this.schedulerRegistry.removeTimeout(key));
  }

  addCron(
    methodRef: Function,
    options: CronOptions & Record<'cronTime', string | Date | any>,
  ) {
    const name = options.name || v4();
    this.cronJobs[name] = {
      target: methodRef,
      options,
    };
  }

  addInterval(methodRef: Function, timeout: number, name: string = v4()) {
    this.intervals[name] = {
      target: methodRef,
      timeout: timeout,
    };
  }

  addTimeout(methodRef: Function, timeout: number, name: string = v4()) {
    this.timeouts[name] = {
      target: methodRef,
      timeout: timeout,
    };
  }
}
