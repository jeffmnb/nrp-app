import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateAccountInput } from './dtos/create-account.dto';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.getUserByEmail(email);
  }

  async createAccount(input: CreateAccountInput): Promise<User> {
    const { name, email, password } = input;
    return this.userRepository.createAccount({ name, email, password });
  }
}
