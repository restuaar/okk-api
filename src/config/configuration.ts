import { ConfigProps } from '../interfaces/config.interface';

export default (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  discordWebhook: {
    on: process.env.DISCORD_WEBHOOK_ON === 'true',
    connectionString: process.env.DISCORD_WEBHOOK_CONNECTION_STRING,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
  },
});
