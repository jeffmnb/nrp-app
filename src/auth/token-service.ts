import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService extends JwtService {
  createAccessToken(payload: { userId: string }) {
    return this.sign(payload, {
      secret: 'topSecret51',
      expiresIn: 300,
    });
  }

  createRefreshToken(payload: { userId: string }) {
    return this.sign(payload, {
      secret: 'topSecretRefresh',
      expiresIn: 6000,
    });
  }

  validateRefreshToken(refresh_token: string) {
    return this.verify(refresh_token, { secret: 'topSecretRefresh' });
  }
}
