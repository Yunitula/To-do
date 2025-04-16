import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';
export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  API_TITLE: string;

  @IsString()
  API_DESCRIPTION: string;

  @IsString()
  API_VERSION: string;

  @IsString()
  API_PREFIX: string;

  @IsString()
  @IsNotEmpty()
  MONGO_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(65535)
  MONGO_PORT: number;

  @IsString()
  @IsNotEmpty()
  MONGO_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  STRATEGY_ACCESS: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_SECRET_KEY_EXPIRE_TIME: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;

  @IsString()
  @IsNotEmpty()
  MAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;

  @IsNumber()
  @IsNotEmpty()
  MAIL_PORT: number;

  @IsBoolean()
  @IsNotEmpty()
  MAIL_SECURE: boolean;

  @IsString()
  @IsNotEmpty()
  MAIL_TEMPLATE_DIR: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CALLBACK: string;
  
  @IsString()
  @IsNotEmpty()
  GOOGLE_SECRET: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_ID: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
