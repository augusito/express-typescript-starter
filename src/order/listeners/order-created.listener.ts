import { OrderCreatedEvent } from '../events/order-created.event';

export class OrderCreatedListener {
  execute(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
