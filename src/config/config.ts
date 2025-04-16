import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './api-config.service';


const configSvc = new ConfigService();
const configService = new AppConfigService(configSvc);

// #Application
export const appHost = configService.getValue('HOST');
export const appPort = configService.getValue('PORT');
export const apiPrefix = configService.getValue('API_PREFIX');

// Swagger
export const apiTitle = configService.getValue('API_TITLE');
export const apiDescription = configService.getValue('API_DESCRIPTION');
export const apiVersion = configService.getValue('API_VERSION');

// Json Web Token
export const jwtStrategy = configService.getValue('STRATEGY_ACCESS');
export const jwtSecretKey = configService.getValue('ACCESS_SECRET_KEY');
export const jwtStrategyTimerPeriod = configService.getValue('ACCESS_SECRET_KEY_EXPIRE_TIME');

//Mail Service
export const emailHost = configService.getValue('MAIL_HOST');
export const emailPort = configService.getValue('MAIL_PORT');
export const emailSecure = configService.getValue('MAIL_SECURE');
export const emailUsername = configService.getValue('MAIL_USERNAME');
export const emailPassword = configService.getValue('MAIL_PASSWORD');
export const tempDir = configService.getValue('MAIL_TEMPLATE_DIR');

//Google OAUTH
export const googleClientID = configService.getValue('CLIENT_ID');
export const googleCallback = configService.getValue('GOOGLE_CALLBACK');
export const googleSecret = configService.getValue('GOOGLE_SECRET');

