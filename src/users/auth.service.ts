import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email already exist
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('This email is already exist');
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and Store in database
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user with this email is not exist');
    }
    // const salt = user.password.split('.')[0];
    // const hashedPart = user.password.split('.')[1];
    const [salt, storedHash] = user.password.split('.');

    // Hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Compare this hash with hash part in database
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('E-mail or password is not valid');
    }
    return user;
  }
}
