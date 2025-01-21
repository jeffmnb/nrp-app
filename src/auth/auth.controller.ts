import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnifiedRequestData } from 'src/decorators/unifield-request-data';
import { SignInInput } from './dtos/signin.dto';
import { SignInOutput } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  signIn(@UnifiedRequestData() input: SignInInput): Promise<SignInOutput> {
    return this.authService.signIn(input);
  }
}
