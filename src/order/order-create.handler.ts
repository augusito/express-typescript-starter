import { Request, Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

export class OrderCreateHandler {
  constructor(private orderService: OrderService) {}

  async handle(req: Request, res: Response) {
    const orderId = await this.orderService.create(req.body as CreateOrderDto);
    return res.status(200).json({ id: orderId });
  }
}
