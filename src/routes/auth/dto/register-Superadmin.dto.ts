import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class registerSuperadmin {
    @ApiProperty({ example: 'John Doe', description: 'fullname' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
  
    @ApiProperty({ example: 'John', description: 'username' })
    @IsNotEmpty({ message: 'username is required' })
    username: string;
  
    @ApiProperty({ example: '12345password', description: 'Password' })
    @IsNotEmpty({ message: 'username is required' })
    password: string;

  }
  