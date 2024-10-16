import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PriOpService } from 'src/pri-op/pri-op.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PriOpService,
    private jwtService: JwtService,
  ) {}

  async validateUserByJwt(payload: any): Promise<any> {
    console.log('payload', payload);
    const user = await this.prisma.user.findFirst({
      where: { id: payload.userId },
    });
    console.log(' auth service', user);

    if (user) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    const payload = { userId: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }
}
