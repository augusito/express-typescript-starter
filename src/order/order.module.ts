import { Application } from '../../lib/application';
import { IContainer } from '../../lib/container';
import { EventEmitter } from '../../lib/event-emitter/event-emitter';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { OrderCreateHandler } from './order-create.handler';

import { OrderService } from './order.service';

export class OrderModule {
  static register() {
    return {
      providers: [
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
        {
          provide: OrderCreatedListener.name,
          useFactory: (container: IContainer) => {
            return new OrderCreatedListener();
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

  static registerRoutes(app: Application) {
    app.post('/orders', OrderCreateHandler.name);
  }
}
