import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { registerSuperadmin } from './dto/register-Superadmin.dto';
import { errorMessage } from 'utils/response';
import { roleEnum } from 'src/config/enums';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async createSuperadmin(registerUserDto: registerSuperadmin) {
    const { name, username, password } = registerUserDto;
    if (!name) errorMessage('Please enter valid name', 'name', 400);
    if (!username) errorMessage('Please enter valid username', 'username', 400);
    if (!password) errorMessage('Please enter valid password', 'password', 400);

    const superUserCheck = await this.userModel.find({
      role: roleEnum.superAdmin,
    });
    if (superUserCheck.length > 0)
      errorMessage('Super user already exists', 'superUserCheck', 400);

    let hashedPassword: string;
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (e) {
      throw e;
    }

    const createSuperAdmin = new this.userModel();
    createSuperAdmin.name = name;
    createSuperAdmin.username = username;
    createSuperAdmin.role = roleEnum.superAdmin;
    createSuperAdmin.password = hashedPassword;
    // createSuperAdmin.status = userStatus.enabled;
    const userCreated = await createSuperAdmin.save();
    const token = this.generateJWT(userCreated);
    const finalData = {
      user: userCreated.toJSON({
        transform: (doc, ret) => {
          delete ret.password;
        },
      }),
      token: token,
    };
    return finalData;
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

  async login(userLoginDto: LoginUserDto) {
    const { username, password } = userLoginDto;
    console.log('hanyoooo')
    if (!username || !password)
      errorMessage('Invalid username or password', 'login', 400);
    const checkUser = await this.userModel.findOne({
      username: username,
      deletedAt: null,
    });
    if (!checkUser) errorMessage('Invalid username or password', 'login', 400);
    const checkPassword = await bcrypt.compare(password, checkUser?.password);

    if (!checkPassword)
      errorMessage('Invalid username or password', 'login', 400);
    const token = await this.generateJWT(checkUser);
    return {
      checkUser,
      token,
    };
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
