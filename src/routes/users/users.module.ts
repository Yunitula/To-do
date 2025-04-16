import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Private } from 'src/config/keys';


@Module({
  imports:[
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ]),
    JwtModule.register({
      secret: Private,
      signOptions: { expiresIn: process.env.ACCESS_SECRET_KEY_EXPIRE_TIME },
      global: true
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
