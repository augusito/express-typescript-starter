import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

export class OrderCreateHandler {
  constructor(private ordersService: OrderService) {}

  handle(req: any, res: any) {
    const { name, description }: CreateOrderDto = req.body;
    const order = this.ordersService.create({ name, description });
    return res.status(200).json(order);
  }
}
