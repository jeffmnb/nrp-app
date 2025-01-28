import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnifiedRequestData } from 'src/decorators/unifield-request-data';
import { SignInInput } from './dtos/signin.dto';
import { AuthOutput } from './auth.types';
import { RefreshTokenInput } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  signIn(@UnifiedRequestData() input: SignInInput): Promise<AuthOutput> {
    return this.authService.signIn(input);
  }

  @Post('refresh-token')
  @HttpCode(200)
  refreshToken(
    @UnifiedRequestData() input: RefreshTokenInput,
  ): Promise<AuthOutput> {
    return this.authService.refreshToken(input);
  }
}
