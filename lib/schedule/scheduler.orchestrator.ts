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

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly ScheduleFactory: ScheduleFactory,
    schedules: any = [],
  ) {
    this.initialize(schedules);
  }

  initialize(schedules: any[]) {
    schedules.forEach((schedule: any) => {
      const { type, options, callback } = schedule;
      switch (type) {
        case SchedulerType.CRON: {
          const prototype = this.ScheduleFactory.prepare(callback);

          this.addCron(prototype.execute.bind(prototype), options);
        }
      }
    });
  }

  onApplicationBootstrap() {
    this.mountCron();
  }

  onApplicationShutdown(signal?: string) {
    this.closeCronJobs();
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

  closeCronJobs() {
    Array.from(this.schedulerRegistry.getCronJobs().keys()).forEach((key) =>
      this.schedulerRegistry.removeCronJob(key),
    );
  }

  addCron(methodRef: Function, options: any) {
    const name = options.name || v4();
    this.cronJobs[name] = {
      target: methodRef,
      options,
    };
  }
}
