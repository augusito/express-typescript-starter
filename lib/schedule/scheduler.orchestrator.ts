import { CronJob } from 'cron';
import { v4 } from 'uuid';
import {
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '../application/interfaces';
import { ScheduleFactory } from './schedule-factory';
import { SchedulerType } from './scheduler-type.enum';
import { SchedulerRegistry } from './scheduler.registry';

export class SchedulerOrchestrator
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly cronJobs: Record<string, any> = {};
  private readonly timeouts: Record<string, any> = {};

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly ScheduleFactory: ScheduleFactory,
    schedules: any = [],
  ) {
    this.init(schedules);
  }

  init(schedules: any[]) {
    schedules.forEach((schedule: any) => {
      const { type, options, callback } = schedule;
      switch (type) {
        case SchedulerType.CRON: {
          const prototype = this.ScheduleFactory.prepare(callback);

          this.addCron(prototype.execute.bind(prototype), options);
          break;
        }
        case SchedulerType.TIMEOUT: {
          const prototype = this.ScheduleFactory.prepare(callback);

          this.addTimeout(prototype.execute.bind(prototype), options);
          break;
        }
      }
    });
  }

  onApplicationBootstrap() {
    this.mountCron();
    this.mountTimeouts();
  }

  onApplicationShutdown(signal?: string) {
    this.closeCronJobs();
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

  clearTimeouts() {
    this.schedulerRegistry
      .getTimeouts()
      .forEach((key) => this.schedulerRegistry.removeTimeout(key));
  }

  addCron(methodRef: Function, options: any) {
    const name = options.name || v4();
    this.cronJobs[name] = {
      target: methodRef,
      options,
    };
  }

  addTimeout(methodRef: Function, options: { name: string; timeout: number }) {
    const name = options.name || v4();
    this.timeouts[name] = {
      target: methodRef,
      timeout: options.timeout,
    };
  }
}
