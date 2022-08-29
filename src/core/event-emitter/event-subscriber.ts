import { OrderCreatedListener } from 'src/order/listeners/order-created.listener';
import { EventEmitter } from 'stream';
import { OnApplicationBootstrap } from '../application/interfaces';
import { LogFactory } from '../logging';
import { EventFactory } from './event-factory';

export class EventSubscriber implements OnApplicationBootstrap {
  private readonly logger = LogFactory.getLog(EventSubscriber.name);
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly eventFactory: EventFactory,
    private readonly events: any = [],
  ) {}

  onApplicationBootstrap() {
    this.loadEventListeners();
  }

  loadEventListeners() {
    this.events.forEach((evt) => {
      const { event, callback } = evt;
      const prototype = this.eventFactory.prepare(callback);

      this.subscribeToEventIfListener(event, prototype);
    });
  }
  subscribeToEventIfListener(event: any, prototype: any) {
    this.eventEmitter.on(event, prototype.execute);
  }
}
