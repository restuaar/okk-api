interface DiscordTransportConfig {
  on: boolean;
  connectionString: string;
}

interface SwaggerConfig {
  enabled: boolean;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
  expiresInRefresh: string;
}

export interface ConfigProps {
  port: number;
  env: string;
  discordWebhook: DiscordTransportConfig;
  swagger: SwaggerConfig;
  jwt: JwtConfig;
}
