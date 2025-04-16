import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { roleEnum } from 'src/config/enums';


export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full Name' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ example: 'example@e.com', description: 'mail' })
  @IsNotEmpty({ message: 'Mail is required' })
  @IsEmail()
  mail: string;

  @ApiProperty({ 
    enum: roleEnum, 
    example: roleEnum.administrator, 
    description: 'User role' 
  })
  @IsNotEmpty()
  @IsEnum(roleEnum)
  role: roleEnum;

  @ApiProperty({ example: '12345password', description: 'Password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  password: string;

}