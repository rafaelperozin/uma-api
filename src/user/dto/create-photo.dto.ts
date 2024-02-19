import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ type: String, example: 'Photo name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, example: 'https://s3.amazonaws.com/bucket/key' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
