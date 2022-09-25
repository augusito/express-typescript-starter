import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserListHandler {
  constructor(private readonly userService: UserService) {}

  handle(req: Request, res: Response) {
    const { id } = req.params;

    if (id) {
      const user = this.userService.getById(+id);
      return res.status(200).json(user);
    }

    const users = this.userService.getAll();
    return res.status(200).json({ users: users });
  }
}
