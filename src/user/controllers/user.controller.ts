import { Body, Controller, Post, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from 'src/exceptions/query-failed.exception';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateUserResponseDto } from 'src/user/dto/create-user-response.dto';
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
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: userApiBody })
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'photos', maxCount: 4 }
    ])
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: UploadedFilesDto
  ): Promise<CreateUserResponseDto> {
    const filesAreValid = !this.userService.validateUpladedFiles(files);
    return filesAreValid && (await this.userService.createUser(createUserDto, files));
  }

  // @Get('me')
  // @ApiOperation({ summary: 'Get the user profile' })
  // async getUserProfile() {
  //   return 'User profile';
  // }
}
