import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { QueryFailedExceptionFilter } from 'src/exceptions/query-failed.exception';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UploadedFilesDto } from 'src/user/models/user.model';
import { userApiBody } from 'src/user/models/user-api-body.model';
import { UserService } from 'src/user/services/user.service';

@ApiTags('users')
@UseFilters(QueryFailedExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user.
   *
   * @param createUserDto - The data for creating a new user.
   * @param files - The uploaded files for the user.
   * @returns A promise that resolves to the created user.
   */
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: userApiBody })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'photos', maxCount: 4 }
    ])
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: UploadedFilesDto
  ): Promise<UserResponseDto> {
    const filesAreValid = !this.userService.validateUpladedFiles(files);
    return filesAreValid && (await this.userService.createUser(createUserDto, files));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get the user profile. **Requires Athentication token on header.' })
  async getUserProfile(@Req() req: any): Promise<UserResponseDto> {
    const user = await this.userService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
