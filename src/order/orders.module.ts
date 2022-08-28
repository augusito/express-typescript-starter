import { IContainer } from '../core/container';
import { EventEmitter } from '../core/event-emitter/event-emitter';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { OrderCreateHandler } from './order-create.handler';

import { OrderService } from './order.service';

export class OrdersModule {
  static register() {
    return {
      providers: [
        {
          provide: OrderCreatedListener.name,
          useClass: OrderCreatedListener,
        },
        {
          provide: OrderService.name,
          useFactory: (container: IContainer) => {
            return new OrderService(container.get(EventEmitter.name));
          },
        },
        {
          provide: OrderCreateHandler.name,
          useFactory: (container: IContainer) => {
            return new OrderCreateHandler(container.get(OrderService.name));
          },
        },
      ],
      events: [
        {
          event: 'order.created',
          callback: OrderCreatedListener.name,
        },
      ],
    };
  }
}
