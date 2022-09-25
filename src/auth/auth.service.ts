import { UserService } from '../user/user.service';
import { JwtService } from '../../lib/jwt';
import { omit } from '../../lib/utils/object.util';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(email: string, pass: string) {
    const user = this.userService.getByEmail(email);
    if (user && user.password === pass) {
      return omit(user, ['password']);
    }
    return null;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
