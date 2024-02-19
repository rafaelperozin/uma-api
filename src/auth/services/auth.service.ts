import { Injectable } from '@nestjs/common';
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
    console.log('___________ 2. loginDto', loginDto);
    const { email, password } = loginDto;

    // validate user
    const user = await this.validateUser(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log('___________ 3. user', user);

    // validate password
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }
    console.log('___________ 4. validPassword ', validPassword);

    // generate and return token
    const payload = { email: user.email, sub: user.id };
    console.log('___________ 5. payload', payload);

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  /**
   * Validates a user by their email.
   * @param email - The email of the user to validate.
   * @returns A Promise that resolves to the validated User object, or null if the user is not found.
   */
  async validateUser(email: string): Promise<User> | null {
    const user = await this.userService.findByEmail(email);
    return user ? user : null;
  }
}
