import { Provider } from 'lib/container';
import { SchedulerRegistry } from './scheduler.registry';

export class ScheduleModule {
  static register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: SchedulerRegistry.name,
          useClass: SchedulerRegistry,
        },
      ],
    };
  }
}
