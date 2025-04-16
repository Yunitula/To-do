import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { EnvironmentVariables } from './env-validations';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getValue<K extends keyof EnvironmentVariables>(
    key: K,
    throwOnMissing = true,
  ): EnvironmentVariables[K] {
    if (throwOnMissing && !this.configService.get(key)) {
      throw new Error(`Config Error - missing env variable: ${key}`);
    }
    return this.configService.get(key);
  }

  getMongoConfig(): MongooseModuleOptions {
    return {
      uri:
        `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/` + `${process.env.MONGO_DATABASE}`+ '?retryWrites=true&w=majority',      
        maxPoolSize: 25,
    };
  }
}
