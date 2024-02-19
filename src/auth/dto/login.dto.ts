import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, example: 'john@doe.com' })
  @IsEmail()
  @Transform(value => {
    return value.value.trim().toLowerCase();
  })
  email: string;

  @ApiProperty({ type: String, example: 'password123' })
  @IsString()
  @Length(6, 50)
  @Exclude({ toPlainOnly: true }) // Hide password from responses
  password: string;
}
