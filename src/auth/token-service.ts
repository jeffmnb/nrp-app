import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENVS } from 'src/env';

@Injectable()
export class TokenService extends JwtService {
  createAccessToken(payload: { userId: string }) {
    return this.sign(payload, {
      secret: ENVS.JWT_SECRET,
      expiresIn: ENVS.JWT_EXPIRES,
    });
  }

  createRefreshToken(payload: { userId: string }) {
    return this.sign(payload, {
      secret: ENVS.REFRESH_SECRET,
      expiresIn: ENVS.REFRESH_EXPIRES,
    });
  }
}
