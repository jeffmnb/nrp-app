import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInInput } from './dtos/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthOutput } from './auth.types';
import { TokenService } from './token-service';
import { TokenExpiredError } from '@nestjs/jwt';
import { RefreshTokenInput } from './dtos/refresh-token.dto';
import { SignUpInput } from './dtos/signup.dto';
import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async signIn(input: SignInInput): Promise<AuthOutput> {
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

  async signUp(input: SignUpInput): Promise<Partial<User>> {
    const existUserWithEmail = await this.prismaService.user.findUnique({
      where: { email: input?.email },
    });
    if (existUserWithEmail) throw new ConflictException('email already in use');

    const { name, email, password } = input;
    const hashedPass = await bcrypt.hash(password, 8);
    return await this.prismaService.user.create({
      data: {
        id: uuid(),
        email,
        name,
        password: hashedPass,
      },
    });
  }

  async refreshToken(input: RefreshTokenInput): Promise<AuthOutput> {
    try {
      const payload = this.tokenService.validateRefreshToken(
        input?.refresh_token,
      );
      const newAccessToken = this.tokenService.createAccessToken({
        userId: payload?.id,
      });
      const newRefreshToken = this.tokenService.createRefreshToken({
        userId: payload?.id,
      });
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh expired token');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
