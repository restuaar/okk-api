import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';
import { ErrorResponse } from 'src/dto/error.dto';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.warn(exception.message, 'PrismaFilter');

    let error: ErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: exception.name,
      message: exception.message,
      report_url: 'https://github.com/restuaar',
    };
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const message = `${exception.meta?.target} already exists`;
        error = {
          ...error,
          status,
          type: ConflictException.name,
          message,
        };
        break;
      }
    }

    return response.status(error.status).json(error);
  }
}
