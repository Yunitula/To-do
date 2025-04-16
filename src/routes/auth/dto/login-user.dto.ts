import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

  @IsNotEmpty({ message: 'username is required' })
  @ApiProperty()
  readonly username: string;

  @IsNotEmpty({ message: 'password is required' })
  @ApiProperty()
  readonly password: string;
}
