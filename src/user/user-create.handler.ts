import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserCreateHandler {
  constructor(private readonly userService: UserService) {}

  handle(req: Request, res: Response) {
    const id = this.userService.create(req.body);
    const user = this.userService.getById(id);
    return res.status(200).json(user);
  }
}
