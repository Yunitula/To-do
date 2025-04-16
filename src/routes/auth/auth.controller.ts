import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/config/keys';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { registerSuperadmin } from './dto/register-Superadmin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { successMessage } from 'utils/response';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register SuperAdmin' })
  @Post('register')
  async register(
    @Body() registerUserDto: registerSuperadmin,
  ) {
    try {
      return successMessage(
        'Superadmin Registered Successfully',
        await this.authService.createSuperadmin(registerUserDto),
      );
    } catch (e) {
      throw e;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Login User' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return successMessage(
        'User Logged in Successfully',
        await this.authService.login(loginUserDto)
      )
    } catch (e) {
      throw e;
    }
    }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }


//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
}
