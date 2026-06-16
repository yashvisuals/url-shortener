import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput, AuthPayload } from './dto/auth.input';

@Resolver()
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
}
