import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInInput } from './dtos/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInOutput } from './auth.types';
import { TokenService } from './token-service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async signIn(input: SignInInput): Promise<SignInOutput> {
    const { email, password } = input;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (isValidPassword) {
      const access_token = this.tokenService.createAccessToken({
        userId: user?.id,
      });
      const refresh_token = this.tokenService.createRefreshToken({
        userId: user?.id,
      });
      return { access_token, refresh_token };
    }
    throw new UnauthorizedException('please check your login credentials');
  }
}
