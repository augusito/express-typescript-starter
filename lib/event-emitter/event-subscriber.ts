import {
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '../application/interfaces';
import { EventEmitter } from './event-emitter';
import { EventFactory } from './event-factory';
import { Listener, EventAndListener } from './interfaces';

export class EventSubscriber
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly eventFactory: EventFactory,
    private readonly events: EventAndListener[] = [],
  ) {}

  onApplicationBootstrap() {
    this.loadEventListeners();
  }

  onApplicationShutdown() {
    this.eventEmitter.removeAllListeners();
  }

  loadEventListeners() {
    this.events.forEach((evt: EventAndListener) => {
      const { event, listener } = evt;
      const prototype = this.eventFactory.prepare(listener);

      this.subscribeToEventIfListener(event, prototype);
    });
  }

  subscribeToEventIfListener(event: string | symbol, prototype: Listener) {
    this.eventEmitter.on(event, prototype.execute.bind(prototype));
  }
}
