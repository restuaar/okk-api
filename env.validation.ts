import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Max(65535)
  PORT: number;

  @IsBoolean()
  @IsOptional()
  DISCORD_WEBHOOK_ON: boolean;

  @IsString()
  @IsOptional()
  DISCORD_WEBHOOK_CONNECTION_STRING: string;

  @IsString()
  @IsOptional()
  DATABASE_URL: string;

  @IsBoolean()
  @IsOptional()
  SWAGGER_ENABLED: boolean;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_SECRET_REFRESH: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN_REFRESH: string;

  @IsString()
  COOKIE_SECRET: string;
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
