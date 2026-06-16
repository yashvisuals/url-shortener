import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { AuthInput, AuthPayload } from './dto/auth.input';
import { GetUser } from './get-user.decorator';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, {
    description: 'Create a new account and return an access token.',
  })
  register(@Args('input') input: AuthInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload, {
    description: 'Log in with existing credentials and return an access token.',
  })
  login(@Args('input') input: AuthInput) {
    return this.authService.login(input);
  }

  @Query(() => User, {
    description: 'The currently authenticated user.',
  })
  @UseGuards(GqlAuthGuard)
  me(@GetUser() user: User) {
    return user;
  }
}
