import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // repo: Repository<User>;
  // constructor(repo: Repository<User>) {
  //   this.repo = repo;
  // }
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // Create a user
  create(email: string, password: string) {
    const user = this.repo.create({ email, password }); // Create an instance from entity-> then validate an instance
    return this.repo.save(user); // store an instance on database
  }

  // Find a user by id
  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne(id);
  }

  // Find all users with given email
  find(email: string) {
    return this.repo.find({ email: email });
  }

  // Updating a given user with id
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  // Removing a user by given id
  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
