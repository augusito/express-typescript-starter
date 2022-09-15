import { IContainer, Provider } from '../container';
import { SchedulerContainer } from './scheduler-container';
import { SchedulerFactory } from './scheduler-factory';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { SchedulerRegistry } from './scheduler.registry';

type Hook = string | Function;

export class SchedulerModule {
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
              container.get(SchedulerFactory.name),
              config.schedules,
            );
          },
        },
        {
          provide: SchedulerContainer.name,
          useFactory: (container: IContainer) => {
            return new SchedulerContainer(container);
          },
        },
        {
          provide: SchedulerFactory.name,
          useFactory: (container: IContainer) => {
            return new SchedulerFactory(container.get(SchedulerContainer.name));
          },
        },
      ],
      hooks: [SchedulerOrchestrator.name],
    };
  }
}
