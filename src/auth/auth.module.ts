import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { AuthController } from './auth.controller';

import { TokenService } from './token-service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    JwtStrategy,
    TokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
