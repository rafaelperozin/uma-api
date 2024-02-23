import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Authenticates a user by validating their credentials and generating an access token.
   * @param loginDto - The login data transfer object containing the user's email and password.
   * @returns An object containing the access token.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  /**
   * Validates a user's email and password.
   *
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A Promise that resolves to the validated User object.
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.validateUserEmail(email);
    if (!user) return null;
    const validPassword = await user.validatePassword(password);
    return user && validPassword ? user : null;
  }

  /**
   * Validates a user by their email.
   * @param email - The email of the user to validate.
   * @returns A Promise that resolves to the validated User object, or null if the user is not found.
   */
  async validateUserEmail(email: string): Promise<User> | null {
    const user = await this.userService.findByEmail(email);
    return user ? user : null;
  }
}
