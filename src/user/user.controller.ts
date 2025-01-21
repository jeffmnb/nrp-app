import { Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UnifiedRequestData } from 'src/decorators/unifield-request-data';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from '@prisma/client';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-account')
  @HttpCode(201)
  createAccount(
    @UnifiedRequestData() input: CreateAccountInput,
  ): Promise<User> {
    return this.userService.createAccount(input);
  }
}
