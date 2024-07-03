import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const responseBody = exception.getResponse();

    return response.status(exception.getStatus()).json({
      status: exception.getStatus(),
      type: exception.name,
      message: responseBody['message'] || responseBody['error'],
      report_url: 'https://github.com/restuaar',
    });
  }
}
