import { ConfigModule } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import DiscordTransport from 'winston-discord-transport';

ConfigModule.forRoot();

const transports: Array<any> = [];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
          },
        ),
      ),
    }),
  );
} else {
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

if (process.env.DISCORD_TRANSPORT === 'true' && process.env.DISCORD_WEBHOOK) {
  transports.push(
    new DiscordTransport({
      webhook: process.env.DISCORD_WEBHOOK,
      defaultMeta: { service: 'my_node_service' },
      level: 'warn',
    }),
  );
}

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports,
});
