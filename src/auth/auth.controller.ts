import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthCredentialsDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthCredentialsDto) {
    return this.authService.login(dto);
  }
}
