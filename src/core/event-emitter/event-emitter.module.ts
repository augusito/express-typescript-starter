import { IContainer } from '../container';
import { EventContainer } from './event-container';
import { EventEmitter } from './event-emitter';
import { EventFactory } from './event-factory';
import { EventSubscriber } from './event-subscriber';

export class EventEmitterModule {
  static register() {
    return {
      providers: [
        {
          provide: EventEmitter.name,
          useClass: EventEmitter,
        },
        {
          provide: EventSubscriber.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            return new EventSubscriber(
              container.get(EventEmitter.name),
              container.get(EventFactory.name),
              config?.events,
            );
          },
        },
        {
          provide: EventContainer.name,
          useFactory: (container: IContainer) => {
            return new EventContainer(container);
          },
        },
        {
          provide: EventFactory.name,
          useFactory: (container: IContainer) => {
            return new EventFactory(container.get(EventContainer.name));
          },
        },
      ],
      hooks: [EventSubscriber.name],
    };
  }
}
