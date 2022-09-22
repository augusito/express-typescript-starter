import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export class UserService {
  private readonly users: User[];
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'james',
        password: 'mwangi',
      },
      {
        id: 2,
        username: 'michael',
        password: 'joesph',
      },
      {
        id: 3,
        username: 'martha',
        password: 'koome',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
    };

    this.users.push(user);

    return user;
  }
}
