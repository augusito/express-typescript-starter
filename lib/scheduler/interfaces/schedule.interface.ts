import { SchedulerType } from '../scheduler-type.enum';
import { CronOptions } from './cron-options.interface';
import { IntervalOptions } from './interval-options.interface';
import { TimeoutOptions } from './timeout-options.interface';

export interface CronSchedule {
  type: SchedulerType.CRON;
  options: CronOptions;
  target: string | Function;
}

export interface IntervalSchedule {
  type: SchedulerType.INTERVAL;
  options: IntervalOptions;
  target: string | Function;
}

export interface TimeoutSchedule {
  type: SchedulerType.TIMEOUT;
  options: TimeoutOptions;
  target: string | Function;
}

export type Schedule = CronSchedule | IntervalSchedule | TimeoutSchedule;
