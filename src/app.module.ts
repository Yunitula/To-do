import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConfigModule } from 'src/config/api-config.module';
import { AppConfigService } from 'src/config/api-config.service';
import { UsersModule } from './routes/users/users.module';
import { AuthModule } from './routes/auth/auth.module';
import { MailService } from './routes/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [AppConfigService],
      useFactory: async (apiConfigService: AppConfigService) => {
        return apiConfigService.getMongoConfig();
      },
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService,],
})
export class AppModule {}
