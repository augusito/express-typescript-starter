import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserCreateHandler {
  constructor(private readonly userService: UserService) {}

  async handle(req: Request, res: Response) {
    const user = await this.userService.create(req.body);

    res.status(200).json(user);
  }
}
