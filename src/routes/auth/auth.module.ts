import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Private } from 'src/config/keys';
import { JwtStrategy } from 'src/guards/jwt/jwt.strategy';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ]),
    JwtModule.register({
      secret: Private,
      signOptions: { expiresIn: process.env.ACCESS_SECRET_KEY_EXPIRE_TIME },
      global: true
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    JwtStrategy
  ],
})
export class AuthModule {}
