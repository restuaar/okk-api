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
  jwt: {
    secret: process.env.JWT_SECRET,
    secretRefresh: process.env.JWT_SECRET_REFRESH,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    expiresInRefresh: process.env.JWT_EXPIRES_IN_REFRESH || '7d',
  },
  cookies: {
    secret: process.env.COOKIE_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});
