import { ApiProperty } from '@nestjs/swagger';
import { CreatePhotoDto } from 'src/user/dto/create-photo.dto';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john@doe.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: 'user' })
  role?: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/key' })
  avatar?: string;

  @ApiProperty({ type: CreatePhotoDto, isArray: true })
  photos?: CreatePhotoDto[];
}
