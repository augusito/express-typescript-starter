import { IContainer, Provider } from '../container';
import { ScheduleContainer } from './schedule-container';
import { ScheduleFactory } from './schedule-factory';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { SchedulerRegistry } from './scheduler.registry';

type Hook = string | Function;

export class ScheduleModule {
  static register(): { providers: Provider[]; hooks: Hook[] } {
    return {
      providers: [
        {
          provide: SchedulerRegistry.name,
          useClass: SchedulerRegistry,
        },
        {
          provide: SchedulerOrchestrator.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            return new SchedulerOrchestrator(
              container.get(SchedulerRegistry.name),
              container.get(ScheduleFactory.name),
              config.schedules,
            );
          },
        },
        {
          provide: ScheduleContainer.name,
          useFactory: (container: IContainer) => {
            return new ScheduleContainer(container);
          },
        },
        {
          provide: ScheduleFactory.name,
          useFactory: (container: IContainer) => {
            return new ScheduleFactory(container.get(ScheduleContainer.name));
          },
        },
      ],
      hooks: [SchedulerOrchestrator.name],
    };
  }
}
