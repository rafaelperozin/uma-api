import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  // Note: Important to add the @ApiResponse() to document the response status code and description.
  async createUser() {
    return 'User created';
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the user profile' })
  async getUserProfile() {
    return 'User profile';
  }
}
