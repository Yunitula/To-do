import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './api-config.service';
import { validate } from './env-validations';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
      ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ApiConfigModule {}
