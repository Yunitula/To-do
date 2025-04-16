import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
import { successMessage } from 'utils/response';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a user',
  })
  @Post('createUser')
  @ApiBearerAuth()
  async createUser(@Body() createUserDto: CreateUserDto, @User() user: any) {
    try {
      return successMessage(
        'User Created Successfully',
        await this.usersService.create(user, createUserDto),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({ summary: 'Get all Users' })
  @Get()
  async findAll(@User() user: any, @Query() filter: FilterUserDto) {
    try {
      return successMessage(
        'Users found successfully',
        await this.usersService.findAll(user, filter),
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get One Users' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return successMessage(
        'Users found successfully',
        await this.usersService.findOne(id),
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Update One Users' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: any,
  ) {
    try {
      return successMessage(
        'Users updated successfully',
        await this.usersService.update(user, id, updateUserDto),
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Change User password.`,
  })
  @Post('changePassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user,
  ) {
    try {
      return successMessage(
        'Password changed successfully',
        await this.usersService.changePassword(changePasswordDto, user),
      );
    } catch (e) {
      throw e;
    }
  }




  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    try {
      return successMessage(
        'Users deleted successfully',
        await this.usersService.remove(user, id),
      );
    } catch (err) {
      throw err;
    }
  }
}
