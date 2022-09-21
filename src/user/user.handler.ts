import { Response } from 'express';
import { UserService } from './user.service';

export class UserHandler {
  constructor(private readonly userService: UserService) {}

  async handle(req: any, res: Response) {
    const { name } = req.query;

    const user = await this.userService.findOne(name);
    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json(user);
  }
}
