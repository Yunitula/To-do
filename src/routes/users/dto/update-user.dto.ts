import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  MinLength,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { roleEnum } from 'src/config/enums';



export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full Name' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john_doe', description: 'Username' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ 
    enum: roleEnum, 
    example: roleEnum.administrator, 
    description: 'User role' 
  })
  @IsOptional()
  @IsEnum(roleEnum)
  role?: roleEnum;

  @ApiPropertyOptional({ example: '12345password', description: 'Password' })
  @IsOptional()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  password?: string;

}