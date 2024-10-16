import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload);
    console.log('payload and token', payload, access_token);

    return { access_token };
  }

  async signup(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }
}
