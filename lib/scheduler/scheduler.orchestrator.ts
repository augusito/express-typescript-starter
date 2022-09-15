import { CronJob } from 'cron';
import { v4 } from 'uuid';
import {
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '../application/interfaces';
import {
  CronOptions,
  IntervalOptions,
  Schedule,
  TimeoutOptions,
} from './interfaces';
import { SchedulerFactory } from './scheduler-factory';
import { SchedulerType } from './scheduler-type.enum';
import { SchedulerRegistry } from './scheduler.registry';

type TargetHost = { target: Function };
type TimeoutHost = { timeout: number };
type RefHost<T> = { ref?: T };
type CronJobHost = { options: CronOptions };

type Cron = TargetHost & CronJobHost & RefHost<CronJob>;
type Interval = TargetHost & TimeoutHost & RefHost<number>;
type Timeout = TargetHost & TimeoutHost & RefHost<number>;

export class SchedulerOrchestrator
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly cronJobs: Record<string, Cron> = {};
  private readonly intervals: Record<string, Interval> = {};
  private readonly timeouts: Record<string, Timeout> = {};

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly ScheduleFactory: SchedulerFactory,
    schedules: Schedule[] = [],
  ) {
    this.init(schedules);
  }

  init(schedules: Schedule[]) {
    schedules.forEach((schedule: Schedule) => {
      const { type, options, target } = schedule;
      switch (type) {
        case SchedulerType.CRON: {
          const prototype = this.ScheduleFactory.prepare(target);
          return this.addCron(prototype.execute.bind(prototype), options);
        }
        case SchedulerType.TIMEOUT: {
          const prototype = this.ScheduleFactory.prepare(target);
          return this.addTimeout(prototype.execute.bind(prototype), options);
        }
        case SchedulerType.INTERVAL: {
          const prototype = this.ScheduleFactory.prepare(target);
          return this.addInterval(prototype.execute.bind(prototype), options);
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

  addCron(methodRef: Function, options: CronOptions) {
    const name = options.name || v4();
    this.cronJobs[name] = {
      target: methodRef,
      options,
    };
  }

  addInterval(methodRef: Function, options: IntervalOptions) {
    const name = options.name || v4();
    this.intervals[name] = {
      target: methodRef,
      timeout: options.timeout,
    };
  }

  addTimeout(methodRef: Function, options: TimeoutOptions) {
    const name = options.name || v4();
    this.timeouts[name] = {
      target: methodRef,
      timeout: options.timeout,
    };
  }
}
