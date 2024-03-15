import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, example: 'John' })
  @IsString()
  @Length(2, 25)
  firstName: string;

  @ApiProperty({ type: String, example: 'Doe' })
  @IsString()
  @Length(2, 25)
  lastName: string;

  @ApiProperty({ type: String, example: 'john@doe.com' })
  @IsEmail()
  @Transform(value => {
    return value.value.trim().toLowerCase();
  })
  email: string;

  @ApiProperty({ type: String, example: 'password123' })
  @IsString()
  @Length(6, 50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,50}$/, {
    message: 'Password must be alphanumeric'
  })
  @Exclude({ toPlainOnly: true }) // Hide password from responses
  password: string;

  @ApiProperty({ type: String, example: 'admin', required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ type: Boolean, example: false, default: true, required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive = true;
}
