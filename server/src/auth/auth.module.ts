import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthResolver } from './auth.resolver';
import { PriOpModule } from 'src/pri-op/pri-op.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { PriOpService } from 'src/pri-op/pri-op.service';

@Module({
  imports: [
    PriOpModule,
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, PriOpService],
  exports: [AuthService],
})
export class AuthModule {}
