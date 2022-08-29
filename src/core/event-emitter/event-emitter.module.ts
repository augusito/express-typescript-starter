import { EventEmitter } from './event-emitter';
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
          useClass: EventSubscriber,
        },
      ],
      hooks: [EventSubscriber.name],
    };
  }
}
