import { EventEmitter } from './event-emitter';

export class EventEmitterModule {
  static register() {
    return {
      providers: [
        {
          provide: EventEmitter.name,
          useClass: EventEmitter,
        },
      ],
    };
  }
}
