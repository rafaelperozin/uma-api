import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/auth/public.decorator';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('___________ 1. loginDto', loginDto);
    return this.authService.login(loginDto);
  }
}
