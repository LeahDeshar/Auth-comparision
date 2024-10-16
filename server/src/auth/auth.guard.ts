import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PriOpService } from 'src/pri-op/pri-op.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PriOpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);

    const authHeader = request?.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      return !!request.user;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = context.getArgs()[2];
      return gqlContext.req;
    }
    return null;
  }
}
