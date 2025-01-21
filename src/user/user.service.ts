import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountInput } from './dtos/create-account.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async createAccount(input: CreateAccountInput): Promise<User> {
    const { name, email, password } = input;

    const hasUserWithSameEmail = await this.getUserByEmail(email);
    if (hasUserWithSameEmail)
      throw new ConflictException('e-mail address already exists');

    const passwordHashed = await bcrypt.hash(password, 8);
    return await this.prismaService.user.create({
      data: {
        id: uuid(),
        name,
        email,
        password: passwordHashed,
      },
    });
  }
}
