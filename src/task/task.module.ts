import { Schedule, SchedulerType } from '../../lib/scheduler';
import { Provider } from '../../lib/container';
import { TaskScheduler } from './task.scheduler';

const EVERY_10_SECONDS = '*/10 * * * * *';

export class TaskModule {
  static register(): { providers: Provider[]; schedules: Schedule[] } {
    return {
      providers: [
        {
          provide: TaskScheduler.name,
          useClass: TaskScheduler,
        },
      ],
      schedules: [
        {
          type: SchedulerType.CRON,
          options: {
            cronTime: EVERY_10_SECONDS,
          },
          target: TaskScheduler.name,
        },
      ],
    };
  }
}
