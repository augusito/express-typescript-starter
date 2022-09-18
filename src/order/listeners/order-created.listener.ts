import { Listener } from '../../../lib/event-emitter/interfaces';
import { OrderCreatedEvent } from '../events/order-created.event';

export class OrderCreatedListener implements Listener {
  execute(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
