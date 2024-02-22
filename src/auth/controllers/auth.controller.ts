import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/auth/public.decorator';
import { AuthService } from 'src/auth/services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
