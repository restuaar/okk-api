interface DiscordTransportConfig {
  on: boolean;
  connectionString: string;
}

export interface ConfigProps {
  port: number;
  env: string;
  discordWebhook: DiscordTransportConfig;
}
