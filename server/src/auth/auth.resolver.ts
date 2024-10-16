import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AuthGuard } from './auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  @UseGuards(AuthGuard)
  hello(_, __, context) {
    const user = context.req.user;

    return `Hello, ${user?.name}!`;
  }
  @Mutation(() => String)
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ) {
    await this.authService.signup(email, password, name);
    return 'User registered successfully';
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.authService.login({ email, password });
    return token.access_token;
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  async protectedResource() {
    return 'You can use this  protected resource';
  }
}
