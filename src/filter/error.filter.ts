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
    const errorMessage = responseBody['message'] || responseBody['error'];

    this.logger.error(errorMessage, 'HttpException', 'ErrorFilter');

    return response.status(exception.getStatus()).json({
      status: exception.getStatus(),
      type: exception.name,
      message: errorMessage,
      report_url: 'https://github.com/restuaar',
    });
  }
}
