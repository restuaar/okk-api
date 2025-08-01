interface DiscordTransportConfig {
  on: boolean;
  connectionString: string;
}

interface SwaggerConfig {
  enabled: boolean;
}

interface JwtConfig {
  secret: string;
  secretRefresh: string;
  expiresIn: string;
  expiresInRefresh: string;
}

interface CookieConfig {
  secret: string;
}

interface RedisConfig {
  host: string;
  port: number;
}

export interface ConfigProps {
  port: number;
  env: string;
  discordWebhook: DiscordTransportConfig;
  swagger: SwaggerConfig;
  jwt: JwtConfig;
  cookies: CookieConfig;
  redis: RedisConfig;
}
