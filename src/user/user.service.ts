import { Database } from 'better-sqlite3';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export class UserService {
  constructor(private readonly db: Database) {}

  getById(id: number | bigint): User {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  getByEmail(email: string): User {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  getAll(): User[] {
    const stmt = this.db.prepare('SELECT * FROM users');
    return stmt.all();
  }

  create(createUserDto: CreateUserDto): number | bigint {
    const stmt = this.db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    );

    const info = stmt.run(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );

    return info.lastInsertRowid;
  }
}
