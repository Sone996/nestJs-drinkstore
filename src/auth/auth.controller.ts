import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequest, LoginRequest, User } from 'libs/dto/src';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Login.',
    type: User,
  })
  @Post('/login')
  login(@Body() body: LoginRequest) {
    return this.authService.login(body);
  }

  @ApiCreatedResponse({
    description: 'Register.',
    type: User,
  })
  @Post('/register')
  register(@Body() body: CreateUserRequest) {
    return this.authService.register(body);
  }
}
