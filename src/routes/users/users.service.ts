import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
;
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
import { roleEnum } from 'src/config/enums';
import { errorMessage } from 'utils/response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(user, createUserDto: CreateUserDto) {
    if (
      user.role !== roleEnum.superAdmin &&
      user.role !== roleEnum.administrator
    ) {
      errorMessage('Access Denied', 'role', 403);
    }

    const { name, username, password, role } =
      createUserDto;

    if (!name) errorMessage('Please enter a valid name', 'name', 400);
    if (!username)
      errorMessage('Please enter a valid username', 'username', 400);
    if (!password)
      errorMessage('Please enter a valid password', 'password', 400);

    const userCheck = await this.userModel.findOne({ username });
    if (userCheck) errorMessage('Username already exists', 'username', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      username,
      password: hashedPassword,
      status,
      role,
    };
   
    const createdUser = await this.userModel.create(newUser);

    const token = this.generateJWT(createdUser);

    return {
      user: createdUser.toJSON({
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      }),
      token,
    };
  }

  public generateJWT(user) {
    return this.jwtService.sign({
      _id: user._id,
      username: user.username,
      role: user.role,
      type: user.userType,
      lastUpdate: new Date().toDateString(),
    });
  }

  async findAll(user: any, filter: FilterUserDto) {
    if (
      user.role !== roleEnum.superAdmin &&
      user.role !== roleEnum.administrator
    ) {
      errorMessage('access denied', 'role', 403);
    }
    const {
      search,
      page = 1,
      sortKey = 'name',
      sort = 'ASC',
    } = filter;
    let { limit = 10 } = filter;
    let findOptions: any = {};
    
    if (search) {
      const searchObj = { $regex: new RegExp(search, 'i') };

      findOptions['$or'] = [
        { username: searchObj },
        { name: searchObj },
        { status: searchObj },
        { role: searchObj },
      ];

    let sortOrder = sort.toLowerCase() === 'desc' ? -1 : 1;
    let sortOptions = {};
    if (sortKey) {
      sortOptions[sortKey] = sortOrder;
    } else {
      sortOptions['name'] = sortOrder;
    }

    const totalCount = await this.userModel.countDocuments(findOptions);

    if (Number(limit) === -1) {
      limit = totalCount;
    }
    console.log(JSON.stringify(findOptions))
    const gotUser = await this.userModel
      .find(findOptions)
      .select('name username role batches groupMembers status')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortOptions)
      .collation({ locale: 'en', strength: 2 });

    const paginate = {
      gotUser,
      page: Number(page),
      limit: Number(limit),
      totalCount: totalCount,
    };
    return paginate;
  }
}

  async findOne(id: string) {
    const gotUser = await this.userModel
      .findById(id)
      .select('name username role batches groupMembers');
    if (!gotUser) errorMessage('user not found', 'user');
    return gotUser;
  }

  async update(user: any, id: string, updateUserDto: UpdateUserDto) {
    if (
      user.role !== roleEnum.superAdmin &&
      user.role !== roleEnum.administrator
    ) {
      errorMessage('Access denied', 'role', 403);
    }

    const { name, password} = updateUserDto;

    if (!name) {
      errorMessage('Please enter valid name', 'name', 400);
    }

    const gotUser = await this.userModel.findById(id);
    if (!gotUser) {
      errorMessage('User not found', 'User', 404);
    }

    if (gotUser?.role === roleEnum.superAdmin) {
      errorMessage('superAdmin cannot be edited', 'role');
    }

    if (password) {
      const saltRounds = 10;
      gotUser.password = await bcrypt.hash(password, saltRounds);
    }
    gotUser.name = name;

    const userUpdated = await gotUser.save();

    const populatedUser = await this.userModel
      .findById(userUpdated._id)

    const finalData = {
      user: populatedUser.toJSON({
        transform: (doc, ret) => {
          delete ret.password;
        },
      }),
    };

    return finalData;
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: User) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;
    const gotUser = await this.userModel.findById(user['userId']);
    const match = await bcrypt.compare(oldPassword, gotUser.password);

    if (!match) {
      return errorMessage('Please enter correct old password', 'Old Password');
    }

    let hashedPassword: string;
    if (newPassword != confirmPassword) {
      errorMessage('Password does not match', 'password');
    } else {
      try {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      } catch (e) {
        throw e;
      }

      gotUser.password = hashedPassword;
      const savedUser = await gotUser.save();
      return {
        user: savedUser.toJSON({
          transform: (doc, ret) => {
            delete ret.password;
          },
        }),
      };
    }
  }


  async remove(user: any, id: string) {
    if (
      user.role !== roleEnum.superAdmin &&
      user.role !== roleEnum.administrator
    ) {
      errorMessage('access denied', 'role', 403);
    }
    const gotUser = await this.userModel.findByIdAndDelete(id);
    if (!gotUser) errorMessage(`user not found`, 'User');
  }
}
