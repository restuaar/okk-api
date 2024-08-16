import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const responseBody = exception.getResponse();
    const errorMessage =
      responseBody['message'] || responseBody['error'] || exception.message;

    this.logger.warn(errorMessage, 'ErrorFilter');

    if (exception.getStatus() === 500) {
      this.logger.error(exception.message, exception.stack, 'ErrorFilter');
    }

    return response.status(exception.getStatus()).json({
      status: exception.getStatus(),
      type: exception.name,
      message: errorMessage,
      report_url: 'https://github.com/restuaar',
    });
  }
}
