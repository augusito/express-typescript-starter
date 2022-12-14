import { Response } from 'express';
import { AuthService } from './auth.service';

export class LoginHandler {
  constructor(private readonly authService: AuthService) {}

  async handle(req: any, res: Response) {
    const { username, password } = req.body;
    const result = this.authService.login({ username, password });

    return res.status(200).json(result);
  }
}
