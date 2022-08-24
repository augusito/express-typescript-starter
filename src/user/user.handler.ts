import { UserService } from './user.service';

export class UserHandler {
  constructor(private readonly userService: UserService) {}

  handle(req: any, res: any) {
    const { name = 'World' } = req.query;
    res.send(this.userService.sayHello(name as string));
  }
}
