import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key',
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    const user = await this.authService.validateUserByJwt(payload);
    console.log(user);
    // if (!user) {
    //   throw new UnauthorizedException('Invalid token');
    // }
    // return user;
    return {};
  }
}
